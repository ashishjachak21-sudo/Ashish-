const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/create-intent', authenticate, paymentController.createPaymentIntent);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
