const Joi = require("joi-oid");

const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  })
);

function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    author: Joi.string().min(1).max(50).required(),
    image: Joi.string().required(),
    description: Joi.string().min(5).max(1024).required(),
    isAvailable: Joi.boolean(),
  }).options({ allowUnknown: true });

  return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;
