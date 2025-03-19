const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require('./routes/analyticsRoutes');
const reportRoutes = require('./routes/reportRoutes');


const app = express();
dotenv.config();

//connect to databse
connectDB();

//middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});