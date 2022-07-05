const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: String,
    body: String,
    imgs: [String],
    img_ids: [String],
    timestamp: Number,
    edited: { type: Boolean, default: false },
    edited_at: Number,
    comment_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    likes: [String],
    dislike_count: { type: Number, default: 0 },
    dislikes: [String],
    reply_count: { type: Number, default: 0 },
    reply: [String],
    owner_id: String, // get user data based on owner_id
    owner_name: String,
    owner_img: String,
  },
  { collection: "posts" }
);

const model = mongoose.model("Post", postSchema);
module.exports = model;
