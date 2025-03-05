const express = require('express');
const router = express.Router();
const { login, getUserProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/profile', protect, getUserProfile);

// Test Protected Route (accessible to any logged-in user)
router.get("/protected", protect , (req, res) => {
  res.json({ msg: "Access granted: You are authenticated!", user: req.user });
});

// Test Role-Based Route (accessible only to admin)
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin!" });
});

module.exports = router;