const ReviewModel = require("../model/reviewModel");

// Create Review
const createReview = async (reviewData) => {
  const review = await ReviewModel.create(reviewData);

  return review;
};

// Get all Reviews
const getReviews = async (query = {}) => {
  const reviews = await ReviewModel.find(query).sort({
    createdAt: -1,
  });

  return reviews;
};

// Get single Review
const getReviewById = async (id) => {
  const review = await ReviewModel.findById(id);

  return review;
};

// Update Review
const updateReview = async (id, updateData) => {
  const review = await ReviewModel.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return review;
};

// Delete Review
const deleteReview = async (id) => {
  const review = await ReviewModel.findByIdAndDelete(id);

  return review;
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};