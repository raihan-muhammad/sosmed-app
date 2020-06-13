const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const { requireLogin } = authController;
const {
  createPost,
  getAllPosts,
  getPostsFollowing,
  getMyPosts,
  like,
  unlike,
  comment,
  deletePost,
} = postController;

router.route("/").get(requireLogin, getAllPosts).post(requireLogin, createPost);
router.route("/following").get(requireLogin, getPostsFollowing);
router.get("/my-post", requireLogin, getMyPosts);
router.put("/like", requireLogin, like);
router.put("/unlike", requireLogin, unlike);
router.put("/comment", requireLogin, comment);
router.delete("/delete-post/:postId", requireLogin, deletePost);

module.exports = router;
