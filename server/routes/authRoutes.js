const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfilePicture,
  getProfilePicture
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/picture', protect, updateProfilePicture); // No multer, expects Base64 string
router.get('/profile/picture/:id', getProfilePicture);




// Test Protected Route (accessible to any logged-in user)
router.get("/protected", protect, (req, res) => {
  res.json({ msg: "Access granted: You are authenticated!", user: req.user });
});

// Test Role-Based Route (accessible only to admin)
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin!" });
});

module.exports = router;
