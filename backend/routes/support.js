const express = require('express');
const {
  createTicket,
  getMyTickets,
  getTicketDetails,
  addMessage,
  getAllTickets,
  assignTicket,
  updateTicketStatus,
  resolveTicket,
  addAttachment,
  uploadAttachment
} = require('../controllers/supportController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes available to all users (with authentication)
router.use(protect);

router.route('/tickets')
  .post(createTicket)
  .get(getMyTickets); // Regular users can only see their own tickets

router.route('/tickets/:ticketId')
  .get(getTicketDetails);

router.route('/tickets/:ticketId/messages')
  .post(addMessage);

// Routes restricted to support staff and admins
router.use(authorize('support', 'admin'));

router.route('/all-tickets')
  .get(getAllTickets);

router.route('/tickets/:ticketId/assign')
  .put(assignTicket);

router.route('/tickets/:ticketId/status')
  .put(updateTicketStatus);

router.route('/tickets/:ticketId/resolve')
  .put(resolveTicket);

router.route('/tickets/:ticketId/attachments')
  .post(uploadAttachment.single('attachment'), addAttachment);

module.exports = router;