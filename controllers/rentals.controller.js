const { Rental } = require("../models/rental.model");
const { Customer } = require("../models/customer.model");
const { Book } = require("../models/book.model");

exports.get = async (req, res) => {
  const rentals = await Rental.find({})
    .sort("-dateOut")
    .populate({
      path: "customer",
      select: "-favouriteGenres",
      populate: { path: "user", model: "User", select: "firstName lastName" },
    })
    .populate({ path: "book", select: "-reviews" });
  if (!rentals.length) return res.status(404).json({ error: "There are no rentals at the moment." });

  res.status(200).json({ rentals });
};

exports.create = async (req, res) => {
  const { book } = req.body;

  const customer = await Customer.findOne({ user: req.user.userId });
  if (!customer) return res.status(400).json({ error: "Rental not created. Create a customer profile to rent a book." });

  const foundBook = await Book.findById(book);
  if (!foundBook) return res.status(400).json({ error: "Invalid book." });

  if (!foundBook.isAvailable) return res.status(400).json({ error: "Book not in stock." });

  await Book.findByIdAndUpdate(book, { isAvailable: false }, { new: true });
  const rental = await new Rental({ customer: customer._id, book });
  rental.save();

  res.status(200).json({ rental });
};

exports.update = async (req, res) => {
  const { book } = req.body;
  const { id } = req.params;

  const customer = await Customer.findOne({ user: req.user.userId });
  if (!customer) return res.status(400).json({ error: "Customer not created. Create a customer profile to rent a book." });

  const foundBook = await Book.findById(book);
  if (!foundBook) return res.status(400).json({ error: "Invalid book." });

  if (!foundBook.isAvailable) return res.status(400).json({ error: "Book not available." });

  const rental = await Rental.findByIdAndUpdate(id, { ...req.body, customer: customer._id, book }, { new: true });

  res.status(200).json({ rental });
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  const rental = await Rental.findById(id);

  const foundRental = await Rental.findOne({ "customer.user._id": req.user.userId });
  if (!foundRental) return res.status(403).json({ error: "Unauthorized." });

  await Book.findByIdAndUpdate(rental.book, { isAvailable: true }, { new: true });

  await Rental.findByIdAndDelete(id);
  if (!rental) return res.status(404).json({ error: "The rental with the given ID was not found." });

  res.status(200).json({ rental });
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id).populate("customer").populate("book");

  if (!rental) return res.status(404).json({ error: "The rental with the given ID was not found." });

  res.status(200).json({ rental });
};
