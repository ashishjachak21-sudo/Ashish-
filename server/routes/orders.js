const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// All order routes require authentication
router.use(authenticate);

router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
