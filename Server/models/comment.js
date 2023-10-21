const mongoose = require("mongoose");

const commentSchema = require("../schemas/comment");

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
