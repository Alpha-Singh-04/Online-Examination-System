const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    },
  ],
  duration: { type: Number, required: true }, // Duration in minutes
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  submissions: {
    type: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        answers: [{ type: String }],
        score: { type: Number, default: 0 },
        submittedAt: { type: Date, default: Date.now },
      }
    ],
    default: [],
  }
});

module.exports = mongoose.model("Exam", examSchema);
