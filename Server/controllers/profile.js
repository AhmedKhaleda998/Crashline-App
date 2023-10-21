const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Post = require('../models/post');

const bcrypt = require('bcrypt');

exports.view = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password -posts').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const posts = await Post.find({ creator: user._id }).select('-creator').lean();
        const hasUserLiked = (post, userId) => {
            if (post.likes && Array.isArray(post.likes)) {
                return post.likes.some(like => like._id.toString() === userId.toString());
            }
            return false;
        };
        user.followersCount = user.followers.length;
        user.followingsCount = user.followings.length;
        posts.forEach(post => {
            post.isLiked = hasUserLiked(post, req.user._id);
            post.likesCount = post.likes.length;
            post.commentsCount = post.comments.length;
            delete post.likes;
            delete post.comments;
        });
        res.status(200).json({ message: 'User profile fetched successfully', user, posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.user = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password').lean();
        user.followersCount = user.followers.length;
        user.followingsCount = user.followings.length;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User fetched successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.changeName = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName } = req.body;
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user = await User.findById(userId).select('-password -posts');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.firstName = firstName;
        user.lastName = lastName;
        await user.save();
        res.status(200).json({ message: 'Name changed successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user = await User.findById(userId).select('-posts');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = newHashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.manipulatePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.file) {
            return res.status(400).json({ error: 'No file selected' });
        }
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user = await User.findById(userId).select('-password -posts');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.picture) {
            clearImage(user.picture);
        }
        user.picture = req.file.path.replace(/\\/g, '/');
        await user.save();
        res.status(201).json({ message: 'Profile picture updated successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deletePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user = await User.findById(userId).select('-password -posts');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!user.picture) {
            return res.status(200).json({ message: 'No profile picture to delete' });
        }
        clearImage(user.picture);
        user.picture = undefined;
        await user.save();
        res.status(200).json({ message: 'Profile picture deleted successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.follow = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ error: "You must login to follow a user" });
        }
        const user = await User.findById(userId).select('-password -posts');
        if (!user) {
            return res.status(401).json({ error: "You must login to follow a user" });
        }
        const { followerId } = req.params;
        const follower = await User.findById(followerId).select('-password -posts');
        if (!follower) {
            return res.status(401).json({ error: "Sorry this user doesn't exist" });
        }
        if (followerId === user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }
        if (user.followings.includes(followerId.toString())) {
            user.followings = user.followings.filter(id => !id.equals(followerId));
            follower.followers = follower.followers.filter(id => !id.equals(user._id));
            await user.save();
            await follower.save();
            return res.json({ message: `You have unfollowed ${follower.firstName} ${follower.lastName}`, user });
        }
        user.followings.push(followerId);
        follower.followers.push(user._id);
        await user.save();
        await follower.save();
        res.json({ message: `You have followed ${follower.firstName} ${follower.lastName}`, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.followers = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "You must login to view followers" });
        }
        const user = await User.findById(userId)
            .select('-password -posts -followings')
            .populate('followers', '-password -posts -followings -followers')
            .lean();
        if (!user) {
            return res.status(401).json({ error: "You must login to view followers" });
        }
        user.followersCount = user.followers.length;
        res.status(200).json({ message: 'Followings fetched successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.followings = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "You must login to view followings" });
        }
        const user = await User.findById(userId)
            .select('-password -posts -followers')
            .populate('followings', '-password -posts -followings -followers')
            .lean();
        if (!user) {
            return res.status(401).json({ error: "You must login to view followings" });
        }
        user.followingsCount = user.followings.length;
        res.status(200).json({ message: 'Followings fetched successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
