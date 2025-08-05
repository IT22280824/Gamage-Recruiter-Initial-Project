const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { protect, adminOnly } = require('../middlewares/auth.js');

// Existing routes
router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.put('/users/:id', protect, adminOnly, adminController.updateUserByAdmin);
router.patch('/users/:id/toggle-active', protect, adminOnly, adminController.toggleUserActiveStatus);

router.patch('/users/:id/toggle-verify', protect, adminOnly, adminController.toggleUserVerification);

router.patch('/users/:id/toggle-active', protect, adminOnly, adminController.toggleUserActiveStatus);


module.exports = router;

