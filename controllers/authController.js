const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: "you must be signed in!" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ status: "Fail", message: "You must be signed in" });
    }

    const { id } = payload;
    const userData = await User.findById(id);
    req.user = userData;
    next();
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { tagline, name, email, password, photo } = req.body;
  if (!tagline || !email || !password || !name) {
    res.status(422).json({
      status: "Fail",
      message: "Please add all the fields",
    });
  }
  const cekEmail = await User.findOne({ email });
  if (cekEmail) {
    res.status(422).json({
      status: "Fail",
      message: "User already exists",
    });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = new User({
    name,
    photo,
    tagline,
    email,
    password: passwordHash,
  });
  const saveUser = await user.save();
  createSendToken(saveUser, 201, req, res);
});

exports.signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      status: "Fail",
      message: "please provide email and password",
    });
  }
  const savedUser = await User.findOne({ email });
  if (!savedUser) {
    return res.status(422).json({
      status: "Fail",
      message: "Invalid email or password",
    });
  }
  const checkPassword = await bcrypt.compare(password, savedUser.password);
  if (checkPassword) {
    createSendToken(savedUser, 201, req, res);
  } else {
    return res.status(422).json({
      status: "Fail",
      message: "Invalid email or password",
    });
  }
});
