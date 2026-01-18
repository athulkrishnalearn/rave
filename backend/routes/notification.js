const express = require('express');
const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Only admins can create notifications
router.use(authorize('admin'));
router.route('/')
  .post(createNotification);

// All admin routes
router.use(authorize('admin', 'support'));
router.route('/')
  .get(getNotifications);

router.route('/unread-count')
  .get(getUnreadCount);

router.route('/:notificationId/read')
  .put(markAsRead);

router.route('/mark-all-read')
  .put(markAllAsRead);

module.exports = router;