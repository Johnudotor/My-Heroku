const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
JWT_SECRET = "dfygkwhdkjhggugg!@#$%^&*&*^&%$";

// signup endpoint
router.post("/signup", async (req, res) => {
  const {
    email,
    password: plainTextPassword,
    phone,
    fullname,
    gender,
  } = req.body;

  // console.log(req.body);
  // checks
  if (!email) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter a valid email address" });
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).send({ status: "error", msg: "Use a valid email." });
  }
  if (!plainTextPassword) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter a password" });
  }
  if (plainTextPassword.length === 8) {
    return res
      .status(400)
      .send({ status: "error", msg: "Password must be eight character long." });
  }

  if (!/[a-zA-Z]{2}\d/.test(plainTextPassword)) {
    return res
      .status(400)
      .send({ status: "error", msg: "Password must be alphanumeric." });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);

  if (!phone) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter your phone Number" });
  }
  if (!phone.length === 11) {
    return res
      .status(400)
      .send({ status: "error", msg: "Your phone Number must be 11 digits" });
  }
  if (!fullname) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter your phone full name" });
  }
  if (!gender) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter your Gender" });
  }

  try {
    const timestamp = Date.now();

    let user = new User();

    user.email = email;
    user.password = password;
    user.fullname = fullname;
    user.phone = phone;
    user.gender = gender;
    user.username = `${email}_${timestamp}`;
    user.img = "";
    user.img_id = "";

    user = await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      JWT_SECRET
    );

    // TODO: Debug later
    // console.log(user, 'here 1');
    // user['token'] = token;

    // console.log(user, 'here 2');

    return res
      .status(200)
      .send({ status: "ok", msg: "User created", user, token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      status: "error",
      msg: "User with the above information already exist",
      e,
    });
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  const { token, email, password } = req.body;

  // checks
  if (!token) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter your generated token" });
  }
  if (!email) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter a valid email address" });
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).send({ status: "error", msg: "Use a valid email." });
  }
  if (!plainTextPassword) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter a password" });
  }
  if (plainTextPassword.length < 6) {
    return res
      .status(400)
      .send({ status: "error", msg: "Password must be longer than six." });
  }

  if (!/[a-zA-Z]{2}\d/.test(plainTextPassword)) {
    return res
      .status(400)
      .send({ status: "error", msg: "Password must be alphanumeric." });
  }
  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: email }).lean();
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", msg: `No user with email: ${email} found` });
    }

    if (await bcrypt.compare(password, user.password)) {
      delete user.password;

      // const token = jwt.sign({
      //     _id: user._id,
      //     email: user.email
      // }, process.env.JWT_SECRET);

      // user['token'] = token;

      return res
        .status(200)
        .send({ status: "ok", msg: "Login successful", user });
    }
    return res
      .status(404)
      .send({ status: "error", msg: "No user with password found" });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Some error occured", e });
  }
});

// endpoint to delete a user
router.post("/delete_user", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields should be filled" });
  }
  try {
    const user = await User.deleteOne({ _id: user_id });

    return res
      .status(200)
      .send({ status: "ok", msg: "delete successful", user });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Some error occured", e });
  }
});

// endpoint to change password

router.post("/change_password", async (req, res) => {
  const { token, oldPassword, newPassword: plainTextPassword } = req.body;
  if (!token || !oldPassword || !plainTextPassword) {
    return res
      .status(400)
      .send({ status: "error", msg: "You must enter all fields" });
  }
  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    const _id = verifiedToken.id;

    const user = await User.findOne({ email: verifiedToken.email }).lean();

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res
        .status(400)
        .send({ status: "error", msg: "Your old password is incorrect" });
    }
    const password = await bcrypt.hash(plainTextPassword, 10);

    const updateUser = await user.updateOne(
      { _id },
      {
        $set: { password },
      }
    );
    return res
      .status(200)
      .send({ status: "ok", msg: "password changed successfully", updateUser });
  } catch (e) {
    console.log(e);
    return res
      .status(404)
      .send({ status: "error", msg: "An unexpected error occured" });
  }
});

module.exports = router;
