const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
JWT_SECRET = "dfygkwhdkjhggugg!@#$%^&*&*^&%$";

const router = express.Router();

// endpoint to search all posts
router.post("/search_post", async (req, res) => {
  const { token, search_string, pagec } = req.body;

  if (!token || !search_string || !pagec) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    let user = jwt.verify(token, JWT_SECRET);

    const resultsPerPage = 5;
    let page = pagec >= 1 ? pagec : 1;
    page = page - 1;

    const posts = await Post.find(
      {
        $or: [
          { title: new RegExp(search_string, "i") },
          { body: new RegExp(search_string, "i") },
          { owner_name: RegExp(search_string, "i") },
        ],
      },
      { title: 1, body: 1, imgs: 1, timestamp: 1, owner_name: 1, owner_img: 1 }
    )
      .sort({ timestamp: "desc" })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .lean();

    return res.status(200).send({ status: "ok", msg: "Success", posts });
  } catch (e) {
    console.log(e);
    return res.status({ status: "error", msg: "An error occured" });
  }
});

// endpoint to search all users

router.post("/search_user", async (req, res) => {
  const { token, search_string, pagec } = req.body;

  if (!token || !search_string || !pagec) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    let user = jwt.verify(token, JWT_SECRET);

    const resultsPerPage = 5;
    let page = pagec >= 1 ? pagec : 1;
    page = page - 1;

    const users = await User.find(
      {
        $or: [
          { email: new RegExp(search_string, "i") },
          { username: new RegExp(search_string, "i") },
          { fullname: RegExp(search_string, "i") },
          { phone: RegExp(search_string, "i") },
          { password: RegExp(search_string, "i") },
        ],
      },
      {
        email: 1,
        username: 1,
        fullname: 1,
        timestamp: 1,
        phone: 1,
        stats: 1,
        password: 1,
      }
    )
      .sort({ timestamp: "desc" })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .lean();

    return res.status(200).send({ status: "ok", msg: "Success", users });
  } catch (e) {
    console.log(e);
    return res.status({ status: "error", msg: "An error occured" });
  }
});

module.exports = router;
