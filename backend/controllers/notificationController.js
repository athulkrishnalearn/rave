const AdminNotification = require('../models/AdminNotification');
const User = require('../models/User');

// Create a notification (used internally by system events)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, recipient, recipientIds } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    const notificationData = {
      title,
      message,
      type: type || 'info',
      priority: priority || 'normal'
    };

    if (recipient === 'specific_admins' && recipientIds) {
      notificationData.recipient = 'specific_admins';
      notificationData.recipientIds = recipientIds;
    } else {
      notificationData.recipient = 'all_admins';
    }

    const notification = await AdminNotification.create(notificationData);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating notification',
      error: error.message
    });
  }
};

// Get notifications for admin
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, priority, isRead, sortBy = '-createdAt' } = req.query;

    // Build filter for admin notifications
    let filter = {
      $or: [
        { recipient: 'all_admins' },
        { recipientIds: req.user.id }
      ]
    };

    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    // Get notifications with pagination
    const notifications = await AdminNotification.find(filter)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await AdminNotification.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting notifications',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await AdminNotification.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user has access to this notification
    if (notification.recipient === 'all_admins' || 
        notification.recipientIds.includes(req.user.id.toString())) {
      
      // Mark as read
      if (!notification.isRead) {
        notification.isRead = true;
        notification.readBy.push({
          userId: req.user.id
        });
        await notification.save();
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this notification'
      });
    }
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const filter = {
      $or: [
        { recipient: 'all_admins' },
        { recipientIds: req.user.id }
      ],
      isRead: false
    };

    await AdminNotification.updateMany(
      filter,
      {
        isRead: true,
        $push: {
          readBy: {
            userId: req.user.id
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking all notifications as read',
      error: error.message
    });
  }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
  try {
    const filter = {
      $or: [
        { recipient: 'all_admins' },
        { recipientIds: req.user.id }
      ],
      isRead: false
    };

    const count = await AdminNotification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting unread count',
      error: error.message
    });
  }
};