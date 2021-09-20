const { Rental } = require("../models/rental.model");
const { Customer } = require("../models/customer.model");
const { Book } = require("../models/book.model");

exports.get = async (req, res) => {
  const rentals = await Rental.find({}).sort("-dateOut").populate("customer").populate("book");
  if (!rentals) return res.status(404).send("There are no rentals at the moment.");

  res.send(rentals);
};

exports.create = async (req, res) => {
  const { book } = req.body;

  const customer = await Customer.findOne({ user: req.user.userId });
  if (!customer) return res.status(400).send("Customer not created. Create a customer profile to rent a book.");

  const foundBook = await Book.findById(book);
  if (!foundBook) return res.status(400).send("Invalid book.");

  if (!foundBook.isAvailable) return res.status(400).send("Book not in stock.");

  const rental = await new Rental({ customer: customer._id, book });
  rental.save();

  res.send(rental);
};

exports.update = async (req, res) => {
  const { book } = req.body;
  const { id } = req.params;

  const customer = await Customer.findOne({ user: req.user.userId });
  if (!customer) return res.status(400).send("Customer not created. Create a customer profile to rent a book.");

  const foundBook = await Book.findById(book);
  if (!foundBook) return res.status(400).send("Invalid book.");

  if (!foundBook.isAvailable) return res.status(400).send("Book not in stock.");

  const rental = await Rental.findByIdAndUpdate(id, { ...req.body, customer: customer._id, book }, { new: true });

  res.send(rental);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const rental = await Rental.findByIdAndDelete(id);
  if (!rental) return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id).populate("customer").populate("book");

  if (!rental) return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
};
