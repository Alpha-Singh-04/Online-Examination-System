const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require('./routes/analyticsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Load env vars
dotenv.config();

const app = express();

// Connect to database
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',  // Dev server
  'https://yourproductionurl.com' // Add production URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  maxAge: 3600,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/student', studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/tests", examRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit with failure
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
