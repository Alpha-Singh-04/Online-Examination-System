
const Test = require('../models/Test');
const Submission = require('../models/Submission');
const User = require('../models/User');

exports.getTestAnalytics = async (req, res) => {
  try {
    const { testId } = req.params;
    
    // Find the test
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Check permissions (only test creator or admin can view analytics)
    if (test.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this test analytics' });
    }
    
    // Get all submissions for this test
    const submissions = await Submission.find({ testId }).populate('userId', 'name');
    
    // Calculate statistics
    const scores = submissions.map(s => s.score);
    const totalStudents = await User.countDocuments({ role: 'student' });
    const submissionsCount = submissions.length;
    
    // Score statistics
    const averageScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
    const highestScore = scores.length ? Math.max(...scores) : 0;
    const lowestScore = scores.length ? Math.min(...scores) : 0;
    
    // Pass rate (assuming 60% is passing score)
    const passingScore = 60;
    const passCount = scores.filter(score => score >= passingScore).length;
    const passRate = submissionsCount ? ((passCount / submissionsCount) * 100).toFixed(2) : 0;
    
    // Completion rate
    const completionRate = totalStudents ? ((submissionsCount / totalStudents) * 100).toFixed(2) : 0;
    
    // Time statistics
    const completionTimes = submissions.map(s => {
      const submissionTime = new Date(s.submittedAt).getTime();
      const startTime = new Date(test.startTime).getTime();
      return (submissionTime - startTime) / (1000 * 60); // in minutes
    });
    
    const avgCompletionTime = completionTimes.length ? 
      (completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length).toFixed(2) : 0;
    const fastestCompletion = completionTimes.length ? Math.min(...completionTimes).toFixed(2) : 0;
    
    // Score distribution (0-20, 21-40, 41-60, 61-80, 81-100)
    const scoreRanges = {
      '0-20%': 0,
      '21-40%': 0,
      '41-60%': 0,
      '61-80%': 0,
      '81-100%': 0
    };
    
    scores.forEach(score => {
      if (score <= 20) scoreRanges['0-20%']++;
      else if (score <= 40) scoreRanges['21-40%']++;
      else if (score <= 60) scoreRanges['41-60%']++;
      else if (score <= 80) scoreRanges['61-80%']++;
      else scoreRanges['81-100%']++;
    });
    
    // Question performance analysis
    const questionPerformance = [];
    
    if (submissions.length > 0 && test.questions.length > 0) {
      test.questions.forEach((question, index) => {
        const correctCount = submissions.filter(s => {
          return s.answers[index] && s.answers[index].toString() === question.correctAnswer.toString();
        }).length;
        
        const correctPercentage = ((correctCount / submissions.length) * 100).toFixed(2);
        
        questionPerformance.push({
          questionNumber: index + 1,
          correctPercentage,
          questionText: question.question.substring(0, 30) + '...'
        });
      });
    }
    
    // Student results
    const studentResults = submissions.map(s => ({
      userId: s.userId._id,
      studentName: s.userId.name,
      score: s.score,
      timeTaken: ((new Date(s.submittedAt).getTime() - new Date(test.startTime).getTime()) / (1000 * 60)).toFixed(2),
      submittedAt: s.submittedAt
    }));
    
    res.json({
      averageScore,
      highestScore,
      lowestScore,
      passRate,
      totalStudents,
      submissionsCount,
      completionRate,
      avgCompletionTime,
      fastestCompletion,
      scoreDistribution: scoreRanges,
      questionPerformance,
      studentResults
    });
    
  } catch (error) {
    console.error('Error fetching test analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};