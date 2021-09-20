const { User } = require("../models/user.model");
const { Customer } = require("../models/customer.model");
const bcrypt = require("bcrypt");

exports.me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password -isAdmin");

  const customer = await Customer.findOne({ user: req.user.userId }).select("-user").populate("favouriteGenres");

  res.send({ user, customer });
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(409).send("User already registered.");

  user = new User({ firstName, lastName, email, password });
  user.password = await bcrypt.hash(password, 10);

  await user.save();

  const { _id } = user;
  const token = user.generateAuthToken();
  res.send({ userId: _id, firstName, lastName, email, token });
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
