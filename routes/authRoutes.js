const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const { signup, signin, resetPassword, newPassword } = authController;

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/reset-password", resetPassword);
router.post("/new-password", newPassword);

module.exports = router;
