const express = require("express");
const { uploadProctoringImage } = require("../controllers/proctorController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/upload", auth, uploadProctoringImage);

module.exports = router;
