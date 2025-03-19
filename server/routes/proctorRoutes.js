const express = require("express");
const { uploadProctoringImage } = require("../controllers/proctorController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/upload", protect, uploadProctoringImage);

module.exports = router;
