const { Book } = require("../models/book.model");
const { Genre } = require("../models/genre.model");
const { Review } = require("../models/review.model");

exports.get = async (req, res) => {
  const books = await Book.find()
    .sort("title")
    .populate("genre")
    .populate("user", "-password -isAdmin")
    .populate({
      path: "reviews",
      select: "-book",
      populate: {
        path: "user",
        model: "User",
        select: "firstName lastName",
      },
    });

  if (!books.length) return res.status(404).send("There aren't book anymore, add a new one!");

  res.send({ books });
};

exports.create = async (req, res) => {
  const { genre } = req.body;

  const foundGenre = await Genre.findOne({ name: genre });
  if (!foundGenre) return res.status(400).send("Invalid genre.");

  let book = await new Book(req.body);
  book.genre = foundGenre._id;
  book.user = req.user.userId;
  book = await book.save();

  res.send({ book });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { genre } = req.body;

  const foundGenre = await Genre.findOne({ name: genre });
  if (!foundGenre) return res.status(400).send("Invalid genre.");

  const book = await Book.findByIdAndUpdate(
    id,
    { ...req.body, genre: { _id: foundGenre._id, name: foundGenre.name } },
    { new: true }
  );
  if (!book) return res.status(404).send("The book with the given ID was not found.");

  res.send({ book });
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) return res.status(404).send("The book with the given ID was not found.");

  for (let r of book.reviews) {
    await Review.findByIdAndDelete(r);
  }

  await Book.findByIdAndDelete(id);

  res.send({ book });
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate("genre").populate("user").exec();

  if (!book) return res.status(404).send("Invalid book.");

  res.send({ book });
};

exports.search = async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({ title: { $regex: q, $options: "i" } })
    .sort("title")
    .populate("genre")
    .populate("user", "-password -isAdmin")
    .populate("reviews", "-user -book");

  if (!books) return res.status(404).send("Invalid search.");

  res.send({ books });
};
