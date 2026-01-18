const express = require('express');
const {
  getAvailableCompanies,
  getAssignedCompanies,
  requestCompanyAccess,
  getLeads,
  updateLeadStatus,
  getLeadDetails,
  submitWeeklyTest,
  getPerformanceSummary,
  getWeeklyTestHistory
} = require('../controllers/salesAgentController');

const { protect, authorize, checkVerification } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require verification
router.use(protect);
router.use(checkVerification);

// Apply role authorization for sales agents only
router.use(authorize('sales_agent'));

// Routes for sales agents
router.route('/companies')
  .get(getAvailableCompanies);

router.route('/companies/assigned')
  .get(getAssignedCompanies);

router.route('/companies/request-access')
  .post(requestCompanyAccess);

router.route('/leads')
  .get(getLeads);

router.route('/leads/:leadId')
  .get(getLeadDetails)
  .put(updateLeadStatus);

router.route('/performance')
  .get(getPerformanceSummary);

router.route('/weekly-test')
  .post(submitWeeklyTest)
  .get(getWeeklyTestHistory);

module.exports = router;