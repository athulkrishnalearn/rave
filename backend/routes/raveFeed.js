const express = require('express');
const {
  getRaveFeed,
  createRaveMoment,
  getRaveMoment,
  addRaveVibe,
  removeRaveVibe,
  addRaveResponse,
  deleteRaveMoment
} = require('../controllers/raveFeedController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getRaveFeed)
  .post(createRaveMoment);

router.route('/:id')
  .get(getRaveMoment)
  .delete(deleteRaveMoment);

router.post('/:id/vibe', addRaveVibe);
router.delete('/:id/vibe', removeRaveVibe);
router.post('/:id/response', addRaveResponse);

module.exports = router;
