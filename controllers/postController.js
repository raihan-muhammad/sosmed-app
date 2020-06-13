const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");

exports.createPost = catchAsync(async (req, res) => {
  const { body, image } = req.body;
  if (!body || !image) {
    return res.status(422).json({
      status: "Fail",
      message: "Please provide all fields",
    });
  }

  req.user.password = undefined;
  const post = new Post({
    body,
    photo: image,
    postedBy: req.user,
  });

  const savedPost = await post.save();
  res.status(200).json({
    status: "success",
    message: "Post added successfully",
    post: savedPost,
  });
});

exports.getAllPosts = catchAsync(async (req, res) => {
  posts = await Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt");
  res.status(200).json({
    status: "Success",
    posts,
  });
});

exports.getPostsFollowing = catchAsync(async (req, res) => {
  posts = await Post.find({
    postedBy: { $in: req.user.following },
  })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt");
  res.status(200).json({
    status: "Success",
    posts,
  });
});

exports.getMyPosts = catchAsync(async (req, res) => {
  const myPosts = await Post.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name"
  );

  res.status(200).json({
    status: "success",
    posts: myPosts,
  });
});

exports.like = catchAsync(async (req, res) => {
  await Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.user._id } },
    { new: true }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, data) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.status(200).json(data);
      }
    });
});

exports.unlike = catchAsync(async (req, res) => {
  await Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, data) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.status(200).json(data);
      }
    });
});

exports.comment = catchAsync(async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  await Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, data) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.status(200).json(data);
      }
    });
});

exports.deletePost = catchAsync(async (req, res) => {
  await Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
