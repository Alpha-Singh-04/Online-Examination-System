const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, "Please add a subject"],
    trim: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [{
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
      required: true,
    },
    options: [{
      text: String,
      isCorrect: Boolean,
    }],
    correctAnswer: String,
    points: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  duration: {
    type: Number,
    required: [true, "Please specify the duration in minutes"],
    min: 1,
  },
  scheduledDate: {
    type: Date,
    required: function() {
      return this.status === 'scheduled';
    }
  },
  startTime: {
    type: String,
    required: [true, "Please specify the start time"],
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format (HH:mm)!`
    }
  },
  endTime: {
    type: String,
    required: [true, "Please specify the end time"],
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format (HH:mm)!`
    }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed'],
    default: 'draft',
  },
  instructions: {
    type: String,
    trim: true,
  },
  totalStudents: {
    type: Number,
    default: 0,
  },
  shuffleQuestions: {
    type: Boolean,
    default: false,
  },
  allowBacktracking: {
    type: Boolean,
    default: true,
  },
  passingPercentage: {
    type: Number,
    default: 40,
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      answer: mongoose.Schema.Types.Mixed,
      score: Number,
    }],
    totalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['submitted', 'graded'],
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Validate that endTime is after startTime
examSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const [startHour, startMinute] = this.startTime.split(':').map(Number);
    const [endHour, endMinute] = this.endTime.split(':').map(Number);
    
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      return next(new Error('End time must be after start time'));
    }
  }
  next();
});

module.exports = mongoose.model("Exam", examSchema);
