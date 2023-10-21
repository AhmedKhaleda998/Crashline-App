const fs = require('fs');
const path = require('path');

const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

exports.create = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ error: "You must login to create a post" });
        }
        const user = await User.findById(userId).select('-password -followers -following');
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        }
        const { title, content } = req.body;
        const post = new Post({ title, content, creator: user._id });
        if (req.file) {
            post.image = req.file.path.replace(/\\/g, '/');
        }
        await post.save();
        user.posts.push(post);
        await user.save();
        res.status(201).json({ message: "Post created successfully", post, creator: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(401).json({ error: "Post Id not found" });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({ error: "Post does not exist" });
        }
        if (post.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to update this post" });
        }
        const { title, content } = req.body;
        post.title = title || post.title;
        post.content = content || post.content;
        if (req.file) {
            if (post.image) {
                clearImage(post.image);
            }
            post.image = req.file.path.replace(/\\/g, '/');
        }
        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.viewAll = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('creator', 'firstName lastName email picture followers')
            .lean();
        const postsNumber = posts.length;
        const hasUserLiked = (post, userId) => {
            if (post.likes && Array.isArray(post.likes)) {
                return post.likes.some(like => like._id.toString() === userId.toString());
            }
            return false;
        };
        const isFollowed = (post, userId) => {
            if (post.creator && post.creator.followers && Array.isArray(post.creator.followers)) {
                return post.creator.followers.some(follower => follower._id.toString() === userId.toString());
            }
            return false;
        };
        posts.forEach(post => {
            post.isLiked = hasUserLiked(post, req.user._id);
            post.creator.isFollowed = isFollowed(post, req.user._id);
            post.likesCount = post.likes.length;
            post.commentsCount = post.comments.length;
            delete post.likes;
            delete post.comments;
        });
        res.status(200).json({ message: "Posts fetched successfully", postsNumber, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.view = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(401).json({ error: "Post Id not found" });
        }
        const post = await Post.findById(postId)
            .populate('creator', 'firstName lastName email picture followers')
            .populate({ path: 'comments', populate: { path: 'creator', select: 'firstName lastName email picture' } })
            .populate('likes', 'firstName lastName email picture')
            .lean();
        if (!post) {
            return res.status(401).json({ error: "Post does not exist" });
        }
        const hasUserLiked = (post, userId) => {
            if (post.likes && Array.isArray(post.likes)) {
                return post.likes.some(like => like._id.toString() === userId.toString());
            }
            return false;
        };
        const isFollowed = (post, userId) => {
            if (post.creator && post.creator.followers && Array.isArray(post.creator.followers)) {
                return post.creator.followers.some(follower => follower._id.toString() === userId.toString());
            }
            return false;
        };
        post.isLiked = hasUserLiked(post, req.user._id);
        post.isFollowed = isFollowed(post, req.user._id);
        post.likesCount = post.likes.length;
        post.commentsCount = post.comments.length;
        res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(401).json({ error: "Post Id not found" });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({ error: "Post does not exist" });
        }
        if (post.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }
        const user = await User.findById(req.user._id).select('-password -followers -following');
        await Post.findByIdAndRemove(postId);
        if (post.image) {
            clearImage(post.image);
        }
        user.posts.pull(postId);
        await user.save();
        res.status(200).json({ message: "Post deleted successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.like = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(401).json({ error: "Post Id not found" });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({ error: "Post does not exist" });
        }
        const user = await User.findById(req.user._id).select('-password -posts -followers -following');
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        }
        const isLiked = post.likes.includes(user._id);
        if (isLiked) {
            post.likes.pull(user._id);
            await post.save();
            return res.status(200).json({ message: "Post unliked successfully", post });
        }
        post.likes.push(user._id);
        await post.save();
        res.status(200).json({ message: "Post liked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.comment = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ error: "You must login to create a post" });
        }
        const user = await User.findById(userId).select('-password -posts -followers -following');
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        }
        const { postId } = req.params;
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(401).json({ error: "Post Id not found" });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({ error: "Post does not exist" });
        }
        const { content } = req.body;
        const comment = new Comment({ content, creator: user._id, post: post._id });
        await comment.save();
        post.comments.push(comment);
        await post.save();
        res.status(201).json({ message: "Comment created successfully", comment, creator: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
