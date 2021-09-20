const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  streetNumber: {
    type: Number,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
    minlength: 4,
  },
  city: {
    type: String,
    reuqired: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
  },
  favouriteGenres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },
  ],
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    street: Joi.string().required(),
    streetNumber: Joi.number().required(),
    postalCode: Joi.number().min(4).required(),
    favouriteGenres: Joi.array().items(Joi.string()),
    city: Joi.string().required(),
    phone: Joi.string().min(5).required(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
