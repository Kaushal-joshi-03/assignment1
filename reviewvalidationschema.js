const Joi = require("joi");

const reviewValidationSchema = Joi.object({
  productId: Joi.string()
    .required()
    .messages({
      "string.empty": "Product ID is required",
      "any.required": "Product ID is required",
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be between 1 and 5",
      "number.max": "Rating must be between 1 and 5",
      "any.required": "Rating is required",
    }),

  comment: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.empty": "Comment is required",
      "string.min": "Comment must be at least 5 characters",
      "string.max": "Comment cannot exceed 500 characters",
      "any.required": "Comment is required",
    }),
});

module.exports = reviewValidationSchema;