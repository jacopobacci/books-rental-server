const express = require("express");
const router = express.Router();
const customers = require("../controllers/customers.controller");
const auth = require("../middleware/auth");
const validateMdw = require("../middleware/validate");
const { validate } = require("../models/customer.model");

router.get("/", customers.get);

router.post("/", [auth, validateMdw(validate)], customers.create);

router.put("/:id", [auth, validateMdw(validate)], customers.update);

router.delete("/:id", auth, customers.delete);

router.get("/:id", customers.getSingle);

module.exports = router;
