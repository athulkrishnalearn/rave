const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createStaff,
  getAllCompanies,
  createCompany,
  updateCompany,
  getAllProducts,
  createProduct,
  updateProduct,
  getAllLeads,
  updateLead,
  getSystemStats,
  banUser,
  unbanUser,
  getPlatformAnalytics,
  moderateContent,
  updateSystemConfig,
  broadcastMessage
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ⚠️ TEMPORARY: Auth middleware disabled for testing
// TODO: Re-enable before production!
// All routes are protected and require admin role
// router.use(protect);
// router.use(authorize('admin'));

// User management routes
router.route('/users')
  .get(getAllUsers);

router.route('/users/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/staff')
  .post(createStaff);

// Company management routes
router.route('/companies')
  .get(getAllCompanies)
  .post(createCompany);

router.route('/companies/:companyId')
  .put(updateCompany);

// Product management routes
router.route('/products')
  .get(getAllProducts)
  .post(createProduct);

router.route('/products/:productId')
  .put(updateProduct);

// Lead management routes
router.route('/leads')
  .get(getAllLeads);

router.route('/leads/:leadId')
  .put(updateLead);

// System stats route
router.route('/stats')
  .get(getSystemStats);

// Platform analytics route
router.route('/analytics')
  .get(getPlatformAnalytics);

// User ban/unban routes
router.route('/users/:userId/ban')
  .post(banUser);

router.route('/users/:userId/unban')
  .post(unbanUser);

// Content moderation route
router.route('/moderate/:contentType/:contentId')
  .post(moderateContent);

// System configuration route
router.route('/config')
  .post(updateSystemConfig);

// Broadcast message route
router.route('/broadcast')
  .post(broadcastMessage);

module.exports = router;