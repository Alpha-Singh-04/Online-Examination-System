const Exam = require("../models/Exams");

// Create an Exam
const createExam = async (req, res) => {
  try {
    const { title, description, subject, questions, duration, startTime, endTime } = req.body;

    if (!title || !subject || !questions || !duration || !startTime || !endTime) {
      return res.status(400).json({ msg: "Please fill all required fields." });
    }

    const exam = new Exam({
      title,
      description,
      subject,
      teacher: req.user.id, // Extracted from auth middleware
      questions,
      duration,
      startTime,
      endTime,
    });

    await exam.save();
    res.status(201).json({ msg: "Exam created successfully!", exam });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all Exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("teacher", "name email");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Exam by ID
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("teacher", "name email");
    if (!exam) return res.status(404).json({ msg: "Exam not found" });

    res.json(exam);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update Exam by ID
const updateExamById = async (req, res) => {
  try {
    const { title, description, subject, questions, duration, startTime, endTime } = req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { title, description, subject, questions, duration, startTime, endTime },
      { new: true, runValidators: true }
    );

    if (!updatedExam) return res.status(404).json({ msg: "Exam not found" });

    res.json({ msg: "Exam updated successfully!", updatedExam });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete Exam by ID
const deleteExamById = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);

    if (!deletedExam) return res.status(404).json({ msg: "Exam not found" });

    res.json({ msg: "Exam deleted successfully!" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};



// Student submits an exam
const submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const { examId } = req.params;
    const studentId = req.user.id;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });

    console.log("Exam found:", exam);

    // Ensure `submissions` is an array
    if (!Array.isArray(exam.submissions)) {
      exam.submissions = []; // Initialize if undefined
    }

    console.log("Submissions before push:", exam.submissions);

    // Auto-grading
    let score = 0;
    for (let i = 0; i < exam.questions.length; i++) {
      if (answers[i] === exam.questions[i].correctAnswer) {
        score++;
      }
    }

    // Store the submission
    exam.submissions.push({
      student: studentId,
      answers,
      score,
    });

    await exam.save();
    res.json({ msg: "Exam submitted successfully!", score });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { createExam, getAllExams, getExamById, updateExamById, deleteExamById, submitExam };