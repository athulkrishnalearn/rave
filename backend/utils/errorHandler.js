const ErrorLog = require('../models/ErrorLog');

// Log error to database
const logError = async (error, req, user = null) => {
  try {
    // Determine error level and severity
    let level = 'error';
    let severity = 'medium';
    
    if (error.status === 500) {
      severity = 'high';
    } else if (error.status >= 400 && error.status < 500) {
      severity = 'low';
    }
    
    // For critical errors
    if (error.message && (
      error.message.toLowerCase().includes('database') ||
      error.message.toLowerCase().includes('connection') ||
      error.message.toLowerCase().includes('mongo')
    )) {
      severity = 'critical';
    }

    await ErrorLog.create({
      level,
      message: error.message,
      stack: error.stack,
      userId: user ? user._id : null,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: error.status || 500,
      severity,
      metadata: {
        params: req.params,
        query: req.query,
        body: req.body
      }
    });
  } catch (logError) {
    // If logging itself fails, at least log to console
    console.error('Failed to log error to database:', logError.message);
  }
};

// Send error response
const sendErrorResponse = (res, error, statusCode = 500) => {
  let errorMessage = error.message || 'Server Error';

  // Don't expose stack trace in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    errorMessage = 'Server Error';
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

// Handle Mongoose validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(e => e.message);
  const message = `Validation Error: ${errors.join(', ')}`;
  return { message, statusCode: 400 };
};

// Handle duplicate field errors (MongoDB)
const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${field}. Please choose another value.`;
  return { message, statusCode: 400 };
};

// Handle invalid ObjectId errors (MongoDB)
const handleCastError = (err) => {
  const message = `Resource not found. Invalid ${err.path}: ${err.value}`;
  return { message, statusCode: 404 };
};

// Handle invalid JWT errors
const handleJWTError = () => {
  const message = 'Invalid token. Please log in again.';
  return { message, statusCode: 401 };
};

// Handle expired JWT errors
const handleJWTExpiredError = () => {
  const message = 'Your token has expired. Please log in again.';
  return { message, statusCode: 401 };
};

// Global error handler middleware
const globalErrorHandler = async (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to database
  await logError(error, req, req.user);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = handleDuplicateFields(err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  sendErrorResponse(res, error, error.statusCode || 500);
};

// Get error logs for admin dashboard
const getErrorLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, level, severity, isResolved, dateFrom, dateTo } = req.query;

    // Build filter
    let filter = {};
    if (level) filter.level = level;
    if (severity) filter.severity = severity;
    if (isResolved !== undefined) filter.isResolved = isResolved === 'true';
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Get error logs with pagination
    const logs = await ErrorLog.find(filter)
      .populate('userId', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await ErrorLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get error logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting error logs',
      error: error.message
    });
  }
};

// Mark error as resolved
const resolveError = async (req, res) => {
  try {
    const { errorId } = req.params;

    const log = await ErrorLog.findByIdAndUpdate(
      errorId,
      {
        isResolved: true,
        resolvedBy: req.user._id,
        resolvedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'name email');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Error log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Error marked as resolved',
      data: log
    });
  } catch (error) {
    console.error('Resolve error error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resolving error',
      error: error.message
    });
  }
};

module.exports = {
  globalErrorHandler,
  getErrorLogs,
  resolveError,
  logError
};