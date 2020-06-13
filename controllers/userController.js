const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Post = require("../models/postModel");

exports.userDetail = catchAsync(async (req, res) => {
  await User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    });
});

exports.follow = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.user._id } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.body.followId } },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
};

exports.unfollow = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.user._id } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.unfollowId } },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
};

exports.updateMe = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name: req.body.name,
        photo: req.body.photo,
        tagline: req.body.tagline,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.json(422).json({ error: err });
      }
      res.status(200).json(result);
    }
  );
};
