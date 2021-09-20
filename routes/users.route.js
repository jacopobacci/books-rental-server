const express = require("express");
const router = express.Router();
const users = require("../controllers/users.controller");
const auth = require("../middleware/auth");
const validateMdw = require("../middleware/validate");
const { validate } = require("../models/user.model");

router.get("/me", auth, users.me);

router.post("/", validateMdw(validate), users.register);

module.exports = router;
