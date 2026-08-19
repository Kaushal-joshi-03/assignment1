const reviewService = require("../service/reviewService");

// 1. POST API - Create Review Controller (Status: 201)
const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body);
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 2. GET API - Get Reviews Controller (Status: 200)
const getReviews = async (req, res) => {
  try {
    const data = await reviewService.getReviews(req.query);
    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  createReview,
  getReviews,
};