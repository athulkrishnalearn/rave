const express = require('express');
const {
  getProducts,
  generateAffiliateLink,
  getAffiliateLinks,
  getEarningsSummary,
  addSocialAccount,
  getSocialAccounts,
  trackClick,
  getLinkAnalytics
} = require('../controllers/creatorController');

const { protect, authorize, checkVerification } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require verification
router.use(protect);
router.use(checkVerification);

// Apply role authorization for creators only
router.use(authorize('creator'));

// Routes for creators
router.route('/products')
  .get(getProducts);

router.route('/affiliate-links')
  .post(generateAffiliateLink)
  .get(getAffiliateLinks);

router.route('/analytics')
  .get(getLinkAnalytics);

router.route('/summary')
  .get(getEarningsSummary);

router.route('/social-accounts')
  .post(addSocialAccount)
  .get(getSocialAccounts);

// Track click (this would typically be handled differently in production)
// For now, this is a simplified version
router.route('/track-click/:affiliateId')
  .get(trackClick);

module.exports = router;