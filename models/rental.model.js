const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customer: Joi.required(),
    book: Joi.required(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
