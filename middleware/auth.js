const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'

  if (!token) return res.status(401).send("Access denied. No token povided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
