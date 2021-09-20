const express = require("express");
const router = express.Router();
const rentals = require("../controllers/rentals.controller");
const auth = require("../middleware/auth");

router.get("/", rentals.get);

router.post("/", auth, rentals.create);

router.put("/:id", auth, rentals.update);

router.delete("/:id", auth, rentals.delete);

router.get("/:id", auth, rentals.getSingle);

module.exports = router;
