const { Genre } = require("../models/genre.model");
const { Book } = require("../models/book.model");

exports.get = async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send({ genres });
};

exports.create = async (req, res) => {
  const { name } = req.body;

  let genre = await Genre.findOne({ name });
  if (genre) return res.status(400).send("This genre already exists.");

  genre = new Genre({ name });
  genre = await genre.save();

  res.send({ genre });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const genre = await Genre.findByIdAndUpdate(id, { name }, { new: true });
  if (!genre) return res.status(404).send("The genre with the given ID was not found.");

  res.send({ genre });
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const bookWithGenre = await Book.find({ "book._id": id });

  if (bookWithGenre) return res.status(403).send("Can't delete the genre, as one or more book is using it.");

  const genre = await Genre.findByIdAndDelete(id);
  if (!genre) return res.status(404).send("The genre with the given ID was not found.");

  res.send({ genre });
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findById(id);

  if (!genre) return res.status(404).send("The genre with the given ID was not found.");

  res.send({ genre });
};
