const User = require("../models/Users");
const Exam = require("../models/Exams");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("teacher", "name email");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get exam by ID
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("teacher", "name email");
    if (!exam) {
      return res.status(404).json({ msg: "Exam not found" });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//Get Teacher by ID
/*
const getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select("-password");
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
*/

module.exports = { getAllUsers, getAllExams, getUserById, getExamById};