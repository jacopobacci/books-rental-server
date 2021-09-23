const { Review } = require("../models/review.model");
const { Book } = require("../models/book.model");

exports.get = async (req, res) => {
  const reviews = await Review.find({}).sort("-createdOn").populate("user", "-password -email");
  if (!reviews) return res.status(404).json({ error: "There are no reviews at the moment." });

  res.status(200).json({ reviews });
};

exports.create = async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) return res.status(400).json({ error: "Invalid book." });

  const foundReview = await Review.findOne({ user: req.user.userId, book: bookId });
  if (foundReview) return res.status(400).json({ error: "One user can only have one review per book." });

  const review = await new Review({ ...req.body, book: bookId, user: req.user.userId });
  review.save();

  book.reviews.push(review);
  await book.save();

  res.status(200).json({ review });
};

exports.update = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
  if (!review) return res.status(400).json({ error: "Invalid review." });

  await review.save();

  res.status(200).json({ review });
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);
  if (!review) return res.status(404).json({ error: "The review with the given ID was not found." });

  res.status(200).json({ review });
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id).populate("user", "-password -email");
  if (!review) return res.status(404).json({ error: "The review with the given ID was not found." });

  res.status(200).json({ review });
};
