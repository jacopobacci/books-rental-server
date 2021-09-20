const { Customer } = require("../models/customer.model");
const { Genre } = require("../models/genre.model");

exports.get = async (req, res) => {
  const customers = await Customer.find()
    .sort("firstName")
    .populate("user", "-password -isAdmin")
    .populate("favouriteGenres")
    .exec();

  if (!customers.length) return res.status(404).send("There aren't customers, create a new one!");

  res.send(customers);
};

exports.create = async (req, res) => {
  const foundCustomer = await Customer.findOne({ user: req.user.userId });
  if (foundCustomer) return res.status(400).send("Customer already exists for this user.");

  const { favouriteGenres } = req.body;
  let genreIds = [];

  for (let genre of favouriteGenres) {
    const foundGenre = await Genre.findOne({ name: genre });
    if (!foundGenre) return res.status(400).send("Invalid genre.");

    genreIds.push(foundGenre._id);
  }

  const customer = await new Customer(req.body);
  customer.favouriteGenres = genreIds;
  customer.user = req.user.userId;
  await customer.save();

  res.send(customer);
};

exports.update = async (req, res) => {
  const { id } = req.params;

  const { favouriteGenres } = req.body;
  let genreIds = [];

  for (let genre of favouriteGenres) {
    const foundGenre = await Genre.findOne({ name: genre });
    if (!foundGenre) return res.status(400).send("Invalid genre.");

    genreIds.push(foundGenre._id);
  }

  const customer = await Customer.findByIdAndUpdate(id, { ...req.body, favouriteGenres: genreIds }, { new: true });

  if (!customer) return res.status(404).send("The customer with the given ID was not found.");

  res.send(customer);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) return res.status(404).send("The customer with the given ID was not found.");

  res.send(customer);
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id).populate("favouriteGenres").populate("user");

  if (!customer) return res.status(404).send("The customer with the given ID was not found.");

  res.send(customer);
};
