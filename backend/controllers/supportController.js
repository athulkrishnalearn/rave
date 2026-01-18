const Ticket = require('../models/Ticket');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for attachment uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/ticket-attachments/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with ticket ID and timestamp
    cb(null, `ticket-${req.params.ticketId || 'temp'}-${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept various file types for attachments
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xls|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and documents are allowed (jpeg, jpg, png, gif, pdf, doc, docx, txt, xls, xlsx).'), false);
  }
};

exports.uploadAttachment = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Create a new ticket (available to all users)
exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority, category } = req.body;

    // Validate required fields
    if (!subject || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Subject, description, and category are required'
      });
    }

    // Create ticket
    const ticket = await Ticket.create({
      subject,
      description,
      priority: priority || 'medium',
      category,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating ticket',
      error: error.message
    });
  }
};

// Get tickets for the authenticated user
exports.getMyTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, category } = req.query;

    // Build filter for user's tickets
    let filter = { createdBy: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Get tickets with pagination
    const tickets = await Ticket.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Ticket.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting tickets',
      error: error.message
    });
  }
};

// Get ticket details
exports.getTicketDetails = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate('createdBy', 'name email userType')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email userType');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has permission to view ticket
    if (req.user.userType !== 'support' && req.user.userType !== 'admin' && 
        ticket.createdBy._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting ticket details',
      error: error.message
    });
  }
};

// Add message to ticket
exports.addMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user has permission to add message
    if (req.user.userType !== 'support' && req.user.userType !== 'admin' && 
        ticket.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add message to this ticket'
      });
    }

    // Add message to ticket
    ticket.messages.push({
      sender: req.user.id,
      message
    });

    await ticket.save();

    // Populate the updated ticket with sender info
    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email userType')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email userType');

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      data: updatedTicket
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding message',
      error: error.message
    });
  }
};

// Support staff: Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, category, assignedTo, createdBy } = req.query;

    // Build filter
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (createdBy) filter.createdBy = createdBy;

    // Get tickets with pagination
    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email userType')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Ticket.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting tickets',
      error: error.message
    });
  }
};

// Support staff: Assign ticket
exports.assignTicket = async (req, res) => {
  try {
    const { staffId } = req.body;

    const staff = await User.findById(staffId);
    if (!staff || (staff.userType !== 'support' && staff.userType !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Valid support staff member not found'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      { assignedTo: staffId },
      { new: true }
    )
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket assigned successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error assigning ticket',
      error: error.message
    });
  }
};

// Support staff: Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      { status },
      { new: true }
    )
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating ticket status',
      error: error.message
    });
  }
};

// Support staff: Resolve ticket
exports.resolveTicket = async (req, res) => {
  try {
    const { resolution } = req.body;

    if (!resolution) {
      return res.status(400).json({
        success: false,
        message: 'Resolution description is required'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      {
        status: 'resolved',
        resolution: {
          description: resolution,
          resolvedBy: req.user.id,
          resolvedAt: new Date()
        }
      },
      { new: true }
    )
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket resolved successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Resolve ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resolving ticket',
      error: error.message
    });
  }
};

// Support staff: Add attachment to ticket
exports.addAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Add attachment to ticket
    ticket.attachments.push({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Attachment added successfully',
      data: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Add attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding attachment',
      error: error.message
    });
  }
};