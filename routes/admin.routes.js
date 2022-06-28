const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

// Render pages
router.get('/products', adminController.getProducts);
router.get('/products/new', adminController.getNewProduct);

// Create a new product
router.post('/products', imageUploadMiddleware, adminController.createNewProduct);

// Update an existing product
router.get('/products/:id', adminController.getUpdateProduct);
router.post('/products/:id', adminController.updateProduct);

module.exports = router;
