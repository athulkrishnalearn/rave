const express = require('express');
const {
  getActivePromotions,
  getAllPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  joinPromotion,
  getMyPromotions,
  updateProgress,
  getParticipants
} = require('../controllers/promotionController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for active promotions
router.route('/active')
  .get(getActivePromotions);

// Route for user to join a promotion
router.use(protect);
router.route('/:promotionId/join')
  .post(joinPromotion);

// Route for user to get their promotions
router.route('/my-promotions')
  .get(getMyPromotions);

// Admin routes
router.use(authorize('admin'));
router.route('/')
  .get(getAllPromotions)
  .post(createPromotion);

router.route('/:promotionId')
  .get(getPromotion)
  .put(updatePromotion)
  .delete(deletePromotion);

router.route('/:promotionId/participants')
  .get(getParticipants);

router.route('/update-progress')
  .post(updateProgress);

module.exports = router;