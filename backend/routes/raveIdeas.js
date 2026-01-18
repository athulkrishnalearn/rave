const express = require('express');
const {
  getRaveIdeas,
  createRaveIdea,
  getRaveIdea,
  applyToIdea,
  handleApplication,
  addVibe,
  addComment,
  updateRaveIdea,
  deleteRaveIdea
} = require('../controllers/raveIdeasController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getRaveIdeas)
  .post(createRaveIdea);

router.route('/:id')
  .get(getRaveIdea)
  .put(updateRaveIdea)
  .delete(deleteRaveIdea);

router.post('/:id/apply', applyToIdea);
router.put('/:id/applications/:applicationId', handleApplication);
router.post('/:id/vibe', addVibe);
router.post('/:id/comment', addComment);

module.exports = router;
