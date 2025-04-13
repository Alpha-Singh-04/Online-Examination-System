exports.getStudentDashboardData = async (req, res) => {
  // Your logic here
  res.json({
    totalTests: 5,
    completedTests: 3,
    averageScore: 78,
    recentActivity: ["Test A attempted", "Test B completed"]
  });
};

// controllers/studentController.js
exports.getDashboardData = async (req, res) => {
  try {
    const user = req.user; 

    res.status(200).json({
      message: "Student dashboard data fetched successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({ message: "Server error" });
  }
};

