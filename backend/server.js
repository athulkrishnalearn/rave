const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth');
const verification = require('./routes/verification');
const creator = require('./routes/creator');
const salesAgent = require('./routes/salesAgent');
const admin = require('./routes/admin');
const support = require('./routes/support');
const promotion = require('./routes/promotion');
const notification = require('./routes/notification');
const freelance = require('./routes/freelance');
const raveFeed = require('./routes/raveFeed');
const raveIdeas = require('./routes/raveIdeas');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rave')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Set static folder
app.use('/uploads', express.static('uploads'));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/verification', verification);
app.use('/api/v1/creator', creator);
app.use('/api/v1/sales-agent', salesAgent);
app.use('/api/v1/admin', admin);
app.use('/api/v1/support', support);
app.use('/api/v1/promotion', promotion);
app.use('/api/v1/notification', notification);
app.use('/api/v1/freelance', freelance);
app.use('/api/v1/rave-feed', raveFeed);
app.use('/api/v1/rave-ideas', raveIdeas);

// Error handler middleware
const { globalErrorHandler } = require('./utils/errorHandler');
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});