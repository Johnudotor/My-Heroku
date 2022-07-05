const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    phone: { type: String, unique: true },
    fullname: String,
    active: { type: Boolean, default: false },
    permissionLevel: Number,
    username: { type: String, unique: true },
    gender: String,
    img: String,
    img_id: String,
    stats: {
      post_count: { type: Number, default: 0 },
      followers_count: { type: Number, default: 0 },
      following_count: { type: Number, default: 0 },
    },
  },
  { collection: "users" },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const model = mongoose.model("User", userSchema);
module.exports = model;
