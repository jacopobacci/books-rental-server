const { Genre } = require("../models/genre.model");
const { Book } = require("../models/book.model");

exports.get = async (req, res) => {
  const genres = await Genre.find().sort("name");

  if (!genres.length) return res.status(404).json({ error: "There aren't still genres, add a new one!" });

  res.status(200).json({ genres });
};

exports.create = async (req, res) => {
  const { name } = req.body;

  let genre = await Genre.findOne({ name });
  if (genre) return res.status(400).json({ error: "This genre already exists." });

  genre = new Genre({ name, user: req.user.userId });
  genre = await genre.save();

  res.status(200).json({ genre });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const foundGenre = await Genre.findOne({ user: req.user.userId });
  if (!foundGenre) return res.status(403).json({ error: "Unauthorized." });

  const genre = await Genre.findByIdAndUpdate(id, { name }, { new: true });
  if (!genre) return res.status(404).json({ error: "The genre with the given ID was not found." });

  res.status(200).json({ genre });
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const bookWithGenre = await Book.findOne({ genre: id });

  if (bookWithGenre) return res.status(403).json({ error: "Can't delete the genre, as one or more book is using it." });

  const foundGenre = await Genre.findOne({ user: req.user.userId });
  if (!foundGenre) return res.status(403).json({ error: "Unauthorized." });

  const genre = await Genre.findByIdAndDelete(id);
  if (!genre) return res.status(404).json({ error: "The genre with the given ID was not found." });

  res.status(200).json({ genre });
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findById(id);

  if (!genre) return res.status(404).json({ error: "The genre with the given ID was not found." });

  res.status(200).json({ genre });
};
