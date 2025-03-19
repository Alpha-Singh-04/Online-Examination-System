// server/src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/test/:testId', protect, reportController.generateTestReport);

module.exports = router;