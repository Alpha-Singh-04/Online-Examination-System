const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with empty profile
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      profile: {} // Initialize empty profile
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ message: 'Invalid role for this user' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword, bio, dateOfBirth, contactNumber, address, education } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    
    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    // Update profile fields
    user.profile = {
      ...user.profile,
      bio: bio || user.profile.bio,
      dateOfBirth: dateOfBirth || user.profile.dateOfBirth,
      contactNumber: contactNumber || user.profile.contactNumber,
      address: address || user.profile.address,
      education: education || user.profile.education,
      lastUpdated: new Date()
    };

    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile picture
// @route   PUT /api/auth/profile/picture
// @access  Private
const updateProfilePicture = async (req, res) => {
  try {
      const { profilePicture } = req.body;

      // Validate Base64 format
      if (!profilePicture || !/^data:image\/(jpeg|png|gif);base64,/.test(profilePicture)) {
          return res.status(400).json({ message: "Invalid image format. Use Base64 encoded JPEG, PNG, or GIF." });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      user.profile.profilePicture = profilePicture; // Store Base64 string
      await user.save();

      res.status(200).json({
          message: "Profile picture updated!",
          profilePicture,
      });
  } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get profile picture
// @route   GET /api/auth/profile/picture/:userId
// @access  Public
const getProfilePicture = async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user || !user.profile.profilePicture) {
          return res.status(404).json({ message: 'Profile picture not found' });
      }
      res.json({ profilePicture: user.profile.profilePicture });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfilePicture,
  getProfilePicture,
}; 