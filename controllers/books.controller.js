const { Book } = require("../models/book.model");
const { Genre } = require("../models/genre.model");
const { Review } = require("../models/review.model");
const { Rental } = require("../models/rental.model");
const { cloudinary } = require("../utils/cloudinary");

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

  if (!books.length) return res.status(404).json({ error: "There aren't still books..." });

  res.status(200).json({ books });
};

exports.create = async (req, res) => {
  try {
    const { genre } = req.body;

    const foundGenre = await Genre.findOne({ name: genre });
    if (!foundGenre) return res.status(400).json({ error: "Invalid genre." });

    const { imageUpload } = req.body;

    if (imageUpload) {
      const uploadResponse = await cloudinary.uploader.upload(imageUpload, {
        upload_preset: "books-rental",
        transformation: [{ width: 1000 }],
      });
      let book = await new Book({ ...req.body, imageUpload: uploadResponse.url, imageUploadId: uploadResponse.public_id });
      book.genre = foundGenre._id;
      book.user = req.user.userId;
      book = await book.save();
      res.status(200).json({ book });
    } else {
      let book = await new Book(req.body);
      book.genre = foundGenre._id;
      book.user = req.user.userId;
      book = await book.save();
      res.status(200).json({ book });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { genre, imageUpload } = req.body;

  const foundGenre = await Genre.findOne({ name: genre });
  if (!foundGenre) return res.status(400).json({ error: "Invalid genre." });

  const foundBook = await Book.findOne({ user: req.user.userId });
  if (!foundBook) return res.status(403).json({ error: "Unauthorized." });

  if (imageUpload) {
    if (foundBook.imageUploadId) {
      cloudinary.uploader.destroy(foundBook.imageUploadId, function (result) {
        console.log(result);
      });
    }
    const uploadResponse = await cloudinary.uploader.upload(imageUpload, {
      upload_preset: "books-rental",
      transformation: [{ width: 1000 }],
    });
    const book = await Book.findByIdAndUpdate(
      id,
      {
        ...req.body,
        genre: { _id: foundGenre._id, name: foundGenre.name },
        imageUpload: uploadResponse.url,
        imageUploadId: uploadResponse.public_id,
      },
      { new: true }
    );
    if (!book) return res.status(404).json({ error: "The book with the given ID was not found." });
    res.status(200).json({ book });
  } else {
    const book = await Book.findByIdAndUpdate(
      id,
      { ...req.body, genre: { _id: foundGenre._id, name: foundGenre.name } },
      { new: true }
    );
    if (!book) return res.status(404).json({ error: "The book with the given ID was not found." });
    res.status(200).json({ book });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ error: "The book with the given ID was not found." });

  const foundBook = await Book.findOne({ user: req.user.userId });
  if (!foundBook) return res.status(403).json({ error: "Unauthorized." });

  if (foundBook.imageUploadId) {
    cloudinary.uploader.destroy(foundBook.imageUploadId, function (result) {
      console.log(result);
    });
  }

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
    .populate({
      path: "reviews",
      select: "-book",
      populate: {
        path: "user",
        model: "User",
        select: "firstName lastName",
      },
    });

  if (!books) return res.status(404).json({ error: "Invalid search." });

  res.status(200).json({ books });
};
