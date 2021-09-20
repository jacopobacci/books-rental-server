const Joi = require("joi");
const mongoose = require("mongoose");

const Review = mongoose.model(
  "Review",
  new mongoose.Schema(
    {
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 512,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    },
    { timestamps: true }
  )
);

function validateReview(review) {
  const schema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    content: Joi.string().min(5).max(512).required(),
  });

  return schema.validate(review);
}

exports.Review = Review;
exports.validate = validateReview;
