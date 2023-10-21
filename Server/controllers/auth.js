const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require("../models/user");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Authentication fail" });
        }
        const token = jwt.sign({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(200).json({
            message: "Authentication successful",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
