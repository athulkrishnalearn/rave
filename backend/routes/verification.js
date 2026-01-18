const express = require('express');
const {
  submitVerification,
  getVerificationStatus,
  getPendingVerifications,
  verifyUser,
  getUserVerificationDetails
} = require('../controllers/verificationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.route('/submit')
  .post(protect, submitVerification);

router.route('/status')
  .get(protect, getVerificationStatus);

// Admin routes
router.route('/pending')
  .get(protect, authorize('admin'), getPendingVerifications);

router.route('/verify/:userId')
  .put(protect, authorize('admin'), verifyUser);

router.route('/user/:userId')
  .get(protect, authorize('admin'), getUserVerificationDetails);

module.exports = router;