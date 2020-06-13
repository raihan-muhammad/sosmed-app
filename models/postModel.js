const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, "Body cannot be empty"],
  },
  photo: {
    type: String,
    required: [true, "Photo cannot be empty"],
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
  ],
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
