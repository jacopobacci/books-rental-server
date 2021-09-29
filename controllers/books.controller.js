const { Book } = require("../models/book.model");
const { Genre } = require("../models/genre.model");
const { Review } = require("../models/review.model");
const { Rental } = require("../models/rental.model");

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

  if (!books.length) return res.status(404).json({ error: "There aren't book anymore, add a new one!" });

  res.status(200).json({ books });
};

exports.create = async (req, res) => {
  const { genre } = req.body;

  const foundGenre = await Genre.findOne({ name: genre });
  if (!foundGenre) return res.status(400).json({ error: "Invalid genre." });

  let book = await new Book(req.body);
  book.genre = foundGenre._id;
  book.user = req.user.userId;
  book = await book.save();

  res.status(200).json({ book });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { genre } = req.body;

  const foundGenre = await Genre.findOne({ name: genre });
  if (!foundGenre) return res.status(400).json({ error: "Invalid genre." });

  const foundBook = await Book.findOne({ user: req.user.userId });
  if (!foundBook) return res.status(403).json({ error: "Unauthorized." });

  const book = await Book.findByIdAndUpdate(
    id,
    { ...req.body, genre: { _id: foundGenre._id, name: foundGenre.name } },
    { new: true }
  );
  if (!book) return res.status(404).json({ error: "The book with the given ID was not found." });

  res.status(200).json({ book });
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ error: "The book with the given ID was not found." });

  const foundBook = await Book.findOne({ user: req.user.userId });
  if (!foundBook) return res.status(403).json({ error: "Unauthorized." });

  for (let r of book.reviews) {
    await Review.findByIdAndDelete(r);
  }

  await Rental.deleteOne({ book: book._id });

  await Book.findByIdAndDelete(id);

  res.status(200).json({ book });
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate("genre").populate("user").exec();

  if (!book) return res.status(404).json({ error: "Invalid book." });

  res.status(200).json({ book });
};

exports.search = async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({ title: { $regex: q, $options: "i" } })
    .sort("title")
    .populate("genre")
    .populate("user", "-password -isAdmin")
    .populate("reviews", "-user -book");

  if (!books) return res.status(404).json({ error: "Invalid search." });

  res.status(200).json({ books });
};
