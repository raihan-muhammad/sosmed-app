const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const { signup, signin } = authController;

router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;
