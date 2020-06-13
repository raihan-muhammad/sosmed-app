const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 8,
  },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/sosmedapp/image/upload/v1591985290/default_eaqogg.jpg",
  },
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
