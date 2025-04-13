const express = require("express");
const router = express.Router();
const {
  createExam,
  getAllExams,
  getExamById,
  submitExam,
  updateExamById,
  deleteExamById,
  getExamHistory,
  getExamResults,
  getExamDetailedResults,
  getTeacherScheduledExams,
  scheduleExam,
  updateScheduledExam,
  deleteScheduledExam,
  getRunningTests
} = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");


// Public route to get current active/running tests
router.get('/running', getRunningTests);

// Protected routes (require authentication)
router.use(protect);

// Create an exam (Only teachers can create)
router.post("/create", authorize("teacher"), createExam);

// Get all exams (Accessible by authenticated users)
router.get("/", getAllExams);

// Get exam results (Only for teachers)
router.get("/results", authorize("teacher"), getExamResults);

// Get detailed results for a specific exam (Only for teachers)
router.get("/results/:examId", authorize("teacher"), getExamDetailedResults);

// Schedule management routes
router.get("/schedule", authorize("teacher"), getTeacherScheduledExams);
router.post("/schedule", authorize("teacher"), scheduleExam);
router.put("/schedule/:id", authorize("teacher"), updateScheduledExam);
router.delete("/schedule/:id", authorize("teacher"), deleteScheduledExam);

// Get a single exam by ID
router.get("/:id", getExamById);

// Update an exam by ID (Only teachers can update)
router.put("/:id", authorize("teacher"), updateExamById);

// Delete an exam by ID (Only teachers can delete)
router.delete("/:id", authorize("teacher"), deleteExamById);

// Student submits an exam
router.post("/submit/:examId", authorize("student"), submitExam);

// Student review an exam
router.get("/:examId/review", authorize("student"), getExamHistory);

module.exports = router;