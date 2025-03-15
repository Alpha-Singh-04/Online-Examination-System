const express = require("express");
const router = express.Router();
const { createExam, getAllExams, getExamById, submitExam, updateExamById, deleteExamById } = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getExamHistory } = require("../controllers/examController");

// Create an exam (Only teachers can create)
router.post("/create", protect, authorize("teacher"), createExam);

// Get all exams (Accessible by authenticated users)
router.get("/", protect, getAllExams);

// Get a single exam by ID
router.get("/:id", protect, getExamById);

// Update an exam by ID (Only teachers can update)
router.put("/:id", protect, authorize("teacher"), updateExamById);

// Delete an exam by ID (Only teachers can delete)
router.delete("/:id", protect, authorize("teacher"), deleteExamById);


// Student submits an exam
router.post("/submit/:examId", protect, authorize("student"), submitExam);

// Student review an exam
router.get("/:examId/review", protect, authorize("student"), getExamHistory);


module.exports = router;