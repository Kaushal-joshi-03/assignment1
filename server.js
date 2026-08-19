const express = require("express");
const mongoose = require("mongoose");

// Exact route file name here:
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = 3000;

// Body Parser Middleware
app.use(express.json());

// Mount review routes
app.use("/api/reviews", reviewRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Review API is running successfully!" });
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// MongoDB Connection
const MONGO_URI = "mongodb://127.0.0.1:27017/review_db";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
