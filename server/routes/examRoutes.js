const express = require("express");
const router = express.Router();
const { createExam, getAllExams, getExamById } = require("../controllers/examController");
const auth = require("../middleware/authMiddleware");
const { updateExamById } = require("../controllers/examController");
const { deleteExamById } = require("../controllers/examController");

// Create an exam (Only teachers can create)
router.post("/create", auth.protect, auth.authorize("teacher"), createExam);

// Get all exams (Accessible by authenticated users)
router.get("/", auth.protect, getAllExams);

// Get a single exam by ID
router.get("/:id", auth.protect, getExamById);

// Update an exam by ID (Only teachers can update)
router.put("/:id", auth.protect, auth.authorize("teacher"), updateExamById);

// Delete an exam by ID (Only teachers can delete)
router.delete("/:id", auth.protect, auth.authorize("teacher"), deleteExamById);

module.exports = router;