const express = require("express");
const router = express.Router();
const { getAllUsers, getAllExams } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Admin routes
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/exams", protect, authorize("admin"), getAllExams);

// Additional admin routes can be added here
//router.post("/create-exam", auth, authorize("admin"), createExam);

module.exports = router;