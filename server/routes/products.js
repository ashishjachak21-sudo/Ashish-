const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes - Seller/Admin
router.post('/', authenticate, authorize('seller', 'admin'), productController.createProduct);
router.put('/:id', authenticate, authorize('seller', 'admin'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('seller', 'admin'), productController.deleteProduct);

module.exports = router;
