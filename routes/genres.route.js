const express = require("express");
const router = express.Router();
const genres = require("../controllers/genres.controller");
const auth = require("../middleware/auth");
const validateMdw = require("../middleware/validate");
const { validate } = require("../models/genre.model");

router.get("/", genres.get);

router.post("/", [validateMdw(validate), auth], genres.create);

router.put("/:id", [validateMdw(validate), auth], genres.update);

router.delete("/:id", auth, genres.delete);

router.get("/:id", genres.getSingle);

module.exports = router;
