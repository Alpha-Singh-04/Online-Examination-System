const Exam = require("../models/Exams");

// Create a new exam
const createExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      duration,
      startTime,
      endTime,
      instructions,
      questions,
      shuffleQuestions,
      allowBacktracking,
      passingPercentage
    } = req.body;

    // Validate required fields
    if (!title || !subject || !duration || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate the date and time
    const examStartTime = new Date(startTime);
    const examEndTime = new Date(endTime);
    const now = new Date();

    if (examStartTime < now) {
      return res.status(400).json({ message: 'Cannot schedule exam in the past' });
    }

    if (examEndTime <= examStartTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Create new exam
    const exam = new Exam({
      title,
      subject,
      teacher: req.user.id,
      duration,
      startTime: examStartTime,
      endTime: examEndTime,
      instructions,
      questions: questions || [],
      shuffleQuestions: shuffleQuestions || false,
      allowBacktracking: allowBacktracking || false,
      passingPercentage: passingPercentage || 60,
      status: 'scheduled'
    });

    await exam.save();
    res.status(201).json({ 
      message: 'Exam created successfully',
      testId: exam._id 
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ 
      message: 'Error creating exam', 
      error: error.message 
    });
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

const isExamAccessible = (exam) => {
  const now = new Date();
  return now >= exam.startTime && now <= exam.endTime;
};


// Student submits an exam
const submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const { examId } = req.params;
    const studentId = req.user.id;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });

    // Check if exam is currently active
    const now = new Date();
    if (now < exam.startTime) {
      return res.status(400).json({ msg: "Exam has not started yet" });
    }
    if (now > exam.endTime) {
      return res.status(400).json({ msg: "Exam has ended" });
    }

    // Check if student has already submitted
    const existingSubmission = exam.submissions.find(sub => sub.student.toString() === studentId);
    if (existingSubmission) {
      return res.status(400).json({ msg: "You have already submitted this exam" });
    }

    // Auto-grade the submission
    let totalScore = 0;
    const gradedAnswers = answers.map((answer, index) => {
      const question = exam.questions[index];
      let isCorrect = false;
      let marksObtained = 0;

      if (question.questionType === 'written') {
        // Written answers need manual grading
        isCorrect = null;
        marksObtained = 0;
      } else {
        isCorrect = answer === question.correctAnswer;
        marksObtained = isCorrect ? question.marks : 0;
        totalScore += marksObtained;
      }

      return {
        text: answer,
        isCorrect,
        marksObtained
      };
    });

    // Store the submission
    exam.submissions.push({
      student: studentId,
      answers: gradedAnswers,
      score: totalScore,
      status: exam.questions.some(q => q.questionType === 'written') ? 'submitted' : 'graded'
    });

    await exam.save();
    res.json({ 
      msg: "Exam submitted successfully!", 
      score: totalScore,
      status: exam.questions.some(q => q.questionType === 'written') ? 'pending_manual_grading' : 'graded'
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Student review an exam
const getExamHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const examId = req.params.examId;

    // console.log(`Student's ID Before : ${studentId}`);

    const exams = await Exam.findOne({ _id: examId, "submissions.student": studentId })
      .populate("submissions.student", "name")
      .select("title subject submissions");

      console.log(`Exams found: ${exams}`);
      if(!exams) {
        return res.status(404).json({ msg: "No exam history found for this student." });
      }


    /*
    const studentExams = exams.map((exam) => {
      const studentSubmission = exam.submissions.find(
        (sub) => sub.student._id.toString() === studentId
      );
      return {
        examTitle: exam.title,
        subject: exam.subject,
        score: studentSubmission?.score || "N/A",
        submittedAt: studentSubmission?.submittedAt || "N/A",
      };
    });
    */


    // Find the specific student's submission
    const studentSubmission = exams.submissions.find(
      (sub) => sub.student._id.toString() === studentId
    );

    if (!studentSubmission) {
      return res.status(404).json({ msg: "No submission found for this student in this exam." });
    }

    const studentExamHistory = {
      examTitle: exams.title,
      subject: exams.subject,
      score: studentSubmission.score || "N/A",
      submittedAt: studentSubmission.submittedAt || "N/A",
    };

    res.json(studentExamHistory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getRunningTests = async (req, res) => {
  try {
    const now = new Date();
    const tests = await Exam.find({
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    res.status(200).json({ tests });
  } catch (error) {
    console.error("Error fetching running tests:", error);
    res.status(500).json({ message: "Server error while fetching running tests." });
  }
};

// Get exam results for teacher
const getExamResults = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const exams = await Exam.find({ teacher: teacherId })
      .populate('submissions.student', 'name')
      .select('title subject startTime submissions duration');

    const formattedExams = exams.map(exam => {
      const submissions = exam.submissions || [];
      const scores = submissions.map(sub => sub.score);
      
      return {
        id: exam._id,
        name: exam.title,
        subject: exam.subject,
        date: exam.startTime,
        studentsCount: submissions.length,
        avgScore: scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
        completionRate: ((submissions.length / (exam.expectedStudents || submissions.length)) * 100).toFixed(1),
        highestScore: Math.max(...scores, 0),
        lowestScore: scores.length ? Math.min(...scores) : 0,
        students: submissions.map(sub => ({
          id: sub.student._id,
          name: sub.student.name,
          score: sub.score,
          timeTaken: Math.round((new Date(sub.submittedAt) - new Date(exam.startTime)) / 60000), // Convert to minutes
          status: sub.status
        }))
      };
    });

    res.json(formattedExams);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get detailed results for a specific exam
const getExamDetailedResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findOne({ _id: examId, teacher: req.user.id })
      .populate('submissions.student', 'name')
      .select('title subject startTime submissions duration questions');

    if (!exam) {
      return res.status(404).json({ msg: "Exam not found" });
    }

    const submissions = exam.submissions || [];
    const scores = submissions.map(sub => sub.score);
    
    // Calculate score distribution
    const scoreRanges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81-100', min: 81, max: 100, count: 0 }
    ];

    submissions.forEach(sub => {
      const score = sub.score;
      const range = scoreRanges.find(r => score >= r.min && score <= r.max);
      if (range) {
        range.count++;
      }
    });

    const result = {
      id: exam._id,
      name: exam.title,
      subject: exam.subject,
      date: exam.startTime,
      studentsCount: submissions.length,
      avgScore: scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
      completionRate: ((submissions.length / (exam.expectedStudents || submissions.length)) * 100).toFixed(1),
      highestScore: Math.max(...scores, 0),
      lowestScore: scores.length ? Math.min(...scores) : 0,
      scoreDistribution: scoreRanges,
      students: submissions.map(sub => ({
        id: sub.student._id,
        name: sub.student.name,
        score: sub.score,
        timeTaken: Math.round((new Date(sub.submittedAt) - new Date(exam.startTime)) / 60000),
        status: sub.status,
        answers: sub.answers
      }))
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all scheduled exams for a teacher
const getTeacherScheduledExams = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const exams = await Exam.find({ 
      teacher: teacherId,
      scheduledDate: { $exists: true },
      status: 'scheduled'
    })
    .select('title subject scheduledDate startTime endTime duration totalStudents instructions status')
    .sort({ scheduledDate: 1, startTime: 1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scheduled exams', error: error.message });
  }
};

// Schedule a new exam
const scheduleExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      scheduledDate,
      startTime,
      endTime,
      duration,
      totalStudents,
      instructions
    } = req.body;

    // Validate required fields
    if (!title || !subject || !scheduledDate || !startTime || !endTime || !duration) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate the date and time
    const examDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (examDate < today) {
      return res.status(400).json({ message: 'Cannot schedule exam in the past' });
    }

    // Create new exam
    const newExam = new Exam({
      title,
      subject,
      teacher: req.user.id,
      scheduledDate,
      startTime,
      endTime,
      duration,
      totalStudents: totalStudents || 0,
      instructions,
      status: 'scheduled',
      questions: [] // Initialize empty questions array
    });

    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling exam', error: error.message });
  }
};

// Update a scheduled exam
const updateScheduledExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const {
      title,
      subject,
      scheduledDate,
      startTime,
      endTime,
      duration,
      totalStudents,
      instructions
    } = req.body;

    // Validate exam ownership
    const exam = await Exam.findOne({ _id: examId, teacher: req.user.id });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or unauthorized' });
    }

    // Validate the date
    const examDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (examDate < today) {
      return res.status(400).json({ message: 'Cannot schedule exam in the past' });
    }

    // Check if exam has already started
    if (exam.status === 'active' || exam.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update an exam that has already started or completed' });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      {
        title,
        subject,
        scheduledDate,
        startTime,
        endTime,
        duration,
        totalStudents,
        instructions
      },
      { new: true, runValidators: true }
    );

    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ message: 'Error updating scheduled exam', error: error.message });
  }
};

// Delete a scheduled exam
const deleteScheduledExam = async (req, res) => {
  try {
    const examId = req.params.id;

    // Validate exam ownership
    const exam = await Exam.findOne({ _id: examId, teacher: req.user.id });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or unauthorized' });
    }

    // Check if exam has already started
    if (exam.status === 'active' || exam.status === 'completed') {
      return res.status(400).json({ message: 'Cannot delete an exam that has already started or completed' });
    }

    await Exam.findByIdAndDelete(examId);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting scheduled exam', error: error.message });
  }
};

module.exports = { 
  createExam, 
  getAllExams, 
  getExamById, 
  updateExamById, 
  deleteExamById, 
  submitExam, 
  getExamHistory,
  getExamResults,
  getExamDetailedResults,
  getTeacherScheduledExams,
  scheduleExam,
  updateScheduledExam,
  deleteScheduledExam,
  getRunningTests
};