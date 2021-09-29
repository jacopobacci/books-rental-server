const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid email or password." });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Invalid email or password." });

  const token = user.generateAuthToken();
  res.status(200).json({ token, userId: user._id });
};
