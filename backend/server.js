const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const studentRoutes = require("./src/routes/studentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/students", studentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health check for frontend (Online/Offline)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


const PORT = process.env.PORT || 5000;

// Start server only after DB connect
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
