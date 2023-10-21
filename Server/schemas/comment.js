const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
},
    {
        timestamps: true,
    }
);

module.exports = commentSchema;