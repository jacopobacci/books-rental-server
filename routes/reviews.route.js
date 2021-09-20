const express = require("express");
const router = express.Router();
const reviews = require("../controllers/reviews.controller");
const auth = require("../middleware/auth");

router.get("/", reviews.get);

router.post("/:bookId", auth, reviews.create);

router.put("/:id", auth, reviews.update);

router.delete("/:id", auth, reviews.delete);

router.get("/:id", reviews.getSingle);

module.exports = router;
