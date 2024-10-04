const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Category Routes
router.post('/', categoryController.createCategory);      
router.get('/', categoryController.getAllCategories);          
router.post('/:id', categoryController.updateCategory);                
router.delete('/:id', categoryController.deleteCategory); 

// Product Routes
router.get('/product', categoryController.fetchProduct);          

module.exports = router;