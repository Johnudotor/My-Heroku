const express = require("express");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const router = express.Router();
JWT_SECRET = "dfygkwhdkjhggugg!@#$%^&*&*^&%$";

// endpoint to dislike a post
router.post("/dislike_post", async (req, res) => {
  const { token, post_id } = req.body;

  if (!token || !post_id) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    let user = jwt.verify(token, JWT_SECRET);
    // check to see if the user has disliked a post before
    const found = await Post.findOne({ _id: post_id, dislikes: user._id });

    if (found)
      return res
        .status(400)
        .send({ status: "error", msg: "You already disliked this post" });

    const post = await Post.findOneAndUpdate(
      { _id: post_id },
      {
        $push: { dislikes: user._id },
        $inc: { dislike_count: 1 },
      },
      { new: true }
    ).lean();

    return res.status(200).send({ status: "ok", msg: "Success", post });
  } catch (e) {
    console.log(e);
    return res.status({ status: "error", msg: "An error occured" });
  }
});

// endpoint to dislike a comment on a post

// endpoint to undislike a post

router.post("/undislike_post", async (req, res) => {
  const { token, post_id } = req.body;

  if (!token || !post_id) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    let user = jwt.verify(token, JWT_SECRET);

    const found = await Post.findOne({ _id: post_id, dislikes: user._id });

    if (!found)
      return res.status(400).send({
        status: "error",
        msg: "You haven't disliked this post before",
      });

    const post = await Post.findOneAndUpdate(
      { _id: post_id },
      {
        $pull: { dislikes: user._id },
        $inc: { dislike_count: -1 },
      },
      { new: true }
    ).lean();

    return res.status(200).send({ status: "ok", msg: "Success", post });
  } catch (e) {
    console.log(e);
    return res.status({ status: "error", msg: "An error occured" });
  }
});

// endpoint to undislike a comment on a post

module.exports = router;
