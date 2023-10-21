const mongoose = require("mongoose");

const postSchema = require("../schemas/post");

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;