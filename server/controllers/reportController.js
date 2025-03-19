
const PDFDocument = require('pdfkit');
const Test = require('../models/Test');
const Submission = require('../models/Submission');
const User = require('../models/User');

exports.generateTestReport = async (req, res) => {
  try {
    const { testId } = req.params;
    
    // Find the test
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Check permissions
    if (test.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to generate this report' });
    }
    
    // Get all submissions
    const submissions = await Submission.find({ testId }).populate('userId', 'name email');
    
    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=test-report-${testId}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add content to the PDF
    // Header
    doc.fontSize(25).text('Test Report', { align: 'center' });
    doc.moveDown();
    
    // Test Information
    doc.fontSize(14).text('Test Information', { underline: true });
    doc.fontSize(12).text(`Title: ${test.title}`);
    doc.text(`Subject: ${test.subject}`);
    doc.text(`Duration: ${test.duration} minutes`);
    doc.text(`Start Time: ${new Date(test.startTime).toLocaleString()}`);
    doc.text(`End Time: ${new Date(test.endTime).toLocaleString()}`);
    doc.moveDown();
    
    // Summary Statistics
    const scores = submissions.map(s => s.score);
    const totalStudents = await User.countDocuments({ role: 'student' });
    const submissionsCount = submissions.length;
    
    doc.fontSize(14).text('Summary Statistics', { underline: true });
    doc.fontSize(12).text(`Total Students: ${totalStudents}`);
    doc.text(`Submissions: ${submissionsCount}`);
    doc.text(`Completion Rate: ${totalStudents ? ((submissionsCount / totalStudents) * 100).toFixed(2) : 0}%`);
    
    if (scores.length > 0) {
      const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
      const highScore = Math.max(...scores);
      const lowScore = Math.min(...scores);
      
      doc.text(`Average Score: ${avgScore}%`);
      doc.text(`Highest Score: ${highScore}%`);
      doc.text(`Lowest Score: ${lowScore}%`);
      
      // Pass rate (assuming 60% is passing)
      const passCount = scores.filter(score => score >= 60).length;
      doc.text(`Pass Rate: ${((passCount / submissionsCount) * 100).toFixed(2)}%`);
    }
    doc.moveDown();
    
    // Question Analysis
    doc.fontSize(14).text('Question Analysis', { underline: true });
    
    if (submissions.length > 0 && test.questions.length > 0) {
      test.questions.forEach((question, index) => {
        const correctCount = submissions.filter(s => {
          return s.answers[index] && s.answers[index].toString() === question.correctAnswer.toString();
        }).length;
        
        const correctPercentage = ((correctCount / submissions.length) * 100).toFixed(2);
        
        doc.fontSize(12).text(`Question ${index + 1}:`);
        doc.fontSize(10).text(question.question);
        doc.fontSize(12).text(`Correct Response Rate: ${correctPercentage}%`);
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(12).text('No data available for question analysis.');
    }
    doc.moveDown();
    
    // Student Results Table
    doc.fontSize(14).text('Student Results', { underline: true });
    doc.moveDown();
    
    // Table header
    const tableTop = doc.y;
    const tableHeaders = ['Student Name', 'Score', 'Submission Time'];
    const columnWidths = [200, 100, 200];
    
    // Draw the table header
    doc.fontSize(12);
    let currentX = 50;
    
    tableHeaders.forEach((header, i) => {
      doc.text(header, currentX, tableTop, { width: columnWidths[i], align: 'left' });
      currentX += columnWidths[i];
    });
    
    doc.moveDown();
    const tableRowHeight = 20;
    
    // Draw rows for each student
    let rowY = doc.y;
    
    submissions.forEach((submission, index) => {
      // Check if we need a new page
      if (rowY > doc.page.height - 100) {
        doc.addPage();
        doc.fontSize(14).text('Student Results (continued)', { underline: true });
        doc.moveDown();
        rowY = doc.y;
        
        // Redraw header on new page
        currentX = 50;
        tableHeaders.forEach((header, i) => {
          doc.fontSize(12).text(header, currentX, rowY, { width: columnWidths[i], align: 'left' });
          currentX += columnWidths[i];
        });
        
        doc.moveDown();
        rowY = doc.y;
      }
      
      currentX = 50;
      doc.fontSize(10).text(submission.userId.name, currentX, rowY, { width: columnWidths[0], align: 'left' });
      currentX += columnWidths[0];
      
      doc.text(`${submission.score}%`, currentX, rowY, { width: columnWidths[1], align: 'left' });
      currentX += columnWidths[1];
      
      doc.text(new Date(submission.submittedAt).toLocaleString(), currentX, rowY, { width: columnWidths[2], align: 'left' });
      
      rowY += tableRowHeight;
    });
    
    // Footer
    doc.fontSize(10).text(`Report generated on ${new Date().toLocaleString()}`, {
      align: 'center',
      bottom: 50
    });
    
    // Finalize the PDF
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};