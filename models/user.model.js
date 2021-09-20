const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { userId: this._id, firstName: this.firstName, lastName: this.lastName, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().min(5).max(250).required().email(),
    password: new passwordComplexity(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
