const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/sign-up', userController.signUp);                
router.get('/:id', userController.getUserById);                
router.post('/:id', userController.updateUser);                
router.delete('/:id', userController.deleteUser);                

module.exports = router;