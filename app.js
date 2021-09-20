if (process.env.NODE_ENV !== "production") require("dotenv").config();

require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const error = require("./middleware/error");
const users = require("./routes/users.route");
const auth = require("./routes/auth.route");
const config = require("config");
const books = require("./routes/books.route");
const customers = require("./routes/customers.route");
const genres = require("./routes/genres.route");
const rentals = require("./routes/rentals.route");
const reviews = require("./routes/reviews.route");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

app.use(cors());
app.use(mongoSanitize());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(compression());

process.on("uncaughtException", (err) => {
  console.error(err.message, err);
});
process.on("unhandledRejection", (err) => {
  console.error(err.message, err);
});

app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/books", books);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/reviews", reviews);
app.use(error);

app.get("/", (req, res) => {
  res.send("Hello from Books Rental API!");
});

const db = process.env.DB_URL || config.get("db");
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(process.env.NODE_ENV !== "production" ? `Connected to ${db}` : "Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;
