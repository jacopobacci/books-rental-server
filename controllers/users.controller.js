const { User } = require("../models/user.model");
const { Customer } = require("../models/customer.model");
const bcrypt = require("bcrypt");

exports.me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password -isAdmin");

  const customer = await Customer.findOne({ user: req.user.userId }).select("-user").populate("favouriteGenres");
  if (!customer) return res.status(404).json({ error: "You have to create a customer to see your profile" });

  res.status(200).json({ user, customer });
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(409).json({ error: "User already registered." });

  user = new User({ firstName, lastName, email, password });
  user.password = await bcrypt.hash(password, 10);

  await user.save();

  const { _id } = user;
  const token = user.generateAuthToken();
  res.status(200).json({ userId: _id, firstName, lastName, email, token });
};
