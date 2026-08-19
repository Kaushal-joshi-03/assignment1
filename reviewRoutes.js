const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/reviewController");
const validationMiddleware = require("../middlewares/validationMiddleware");
const reviewValidationSchema = require("../validationSchema/reviewValidationSchema");

router.post(
  "/create",
  validationMiddleware(reviewValidationSchema),
  reviewController.createReview
);

module.exports = router;