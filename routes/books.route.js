const express = require("express");
const router = express.Router();
const books = require("../controllers/books.controller");
const validateMdw = require("../middleware/validate");
const auth = require("../middleware/auth");
const { validate } = require("../models/book.model");

router.get("/", books.get);

router.get("/search", books.search);

router.post("/", [auth, validateMdw(validate)], books.create);

router.put("/:id", [auth, validateMdw(validate)], books.update);

router.delete("/:id", auth, books.delete);

router.get("/:id", books.getSingle);

module.exports = router;
