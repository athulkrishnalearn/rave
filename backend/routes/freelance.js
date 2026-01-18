const express = require('express');
const router = express.Router();
const FreelancerProfile = require('../models/FreelancerProfile');
const Gig = require('../models/Gig');
const FreelanceOrder = require('../models/FreelanceOrder');
const { protect, authorize } = require('../middleware/auth');

// --- Freelancer Profile Routes ---
router.post('/profile', protect, async (req, res) => {
  try {
    const profile = await FreelancerProfile.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/profile/me', protect, async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOne({ userId: req.user.id });
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Gig Routes ---
router.post('/gigs', protect, authorize('freelancer'), async (req, res) => {
  try {
    const gig = await Gig.create({
      ...req.body,
      freelancerId: req.user.id
    });
    res.status(201).json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/gigs', async (req, res) => {
  try {
    const gigs = await Gig.find({ active: true }).populate('freelancerId', 'name');
    res.status(200).json({ success: true, data: gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Order Routes ---
router.post('/orders', protect, authorize('client'), async (req, res) => {
  try {
    const order = await FreelanceOrder.create({
      ...req.body,
      clientId: req.user.id
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/orders/freelancer', protect, authorize('freelancer'), async (req, res) => {
  try {
    const orders = await FreelanceOrder.find({ freelancerId: req.user.id }).populate('clientId', 'name');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/orders/client', protect, authorize('client'), async (req, res) => {
  try {
    const orders = await FreelanceOrder.find({ clientId: req.user.id }).populate('freelancerId', 'name');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
