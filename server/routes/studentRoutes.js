// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

// Define the dashboard route
router.get('/dashboard', protect, studentController.getDashboardData);

module.exports = router;
