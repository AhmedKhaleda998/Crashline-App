const Joi = require('joi');


// Register Validation
const registerErrorMessages = (field) => ({
    'string.empty': `${field} cannot be an empty field`,
    'string.min': `${field} is too short`,
    'any.required': `${field} is a required field`,
    'string.email': `${field} should be a valid email`,
    'string.alphanum': `${field} should be alphabets`,
    'string.pattern.base': `${field} should contain at least one uppercase letter, one lowercase letter and one digit`,
    'string.base': `${field} should be a type of 'text'`,
});

const registerSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .trim()
        .min(3).max(128)
        .alphanum()
        .messages(registerErrorMessages('First name')),
    lastName: Joi.string()
        .required()
        .trim()
        .min(3).max(128)
        .alphanum()
        .messages(registerErrorMessages('Last name')),
    email: Joi.string()
        .required()
        .trim()
        .email()
        .messages(registerErrorMessages('Email')),
    password: Joi.string()
        .required()
        .trim()
        .min(8).max(256)
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
        .messages(registerErrorMessages('Password')),
});

exports.registerValidation = (req, res, next) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
};


// Login Validation
const loginErrorMessages = (field) => ({
    'string.empty': `${field} cannot be an empty field`,
    'any.required': `${field} is a required field`,
    'string.email': `${field} should be a valid email`,
    'string.base': `${field} should be a type of 'text'`,
});

const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .trim()
        .email()
        .messages(loginErrorMessages('Email')),
    password: Joi.string()
        .required()
        .trim()
        .messages(loginErrorMessages('Password')),
});

exports.loginValidation = (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
};


//Change Password Validation
const changePasswordErrorMessages = (field) => ({
    'string.empty': `${field} cannot be an empty field`,
    'string.min': `${field} is too short`,
    'any.required': `${field} is a required field`,
    'string.pattern.base': `${field} should contain at least one uppercase letter, one lowercase letter and one digit`,
    'string.base': `${field} should be a type of 'text'`,
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .trim()
        .messages(changePasswordErrorMessages('Old password')),
    newPassword: Joi.string()
        .required()
        .trim()
        .min(8).max(256)
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
        .messages(changePasswordErrorMessages('New password')),
});

exports.changePasswordValidation = (req, res, next) => {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
};


// Change name validation
const changeNameErrorMessages = (field) => ({
    'string.empty': `${field} cannot be an empty field`,
    'string.min': `${field} is too short`,
    'any.required': `${field} is a required field`,
    'string.alphanum': `${field} should be alphabets`,
    'string.base': `${field} should be a type of 'text'`,
});

const changeNameSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .trim()
        .min(3).max(128)
        .alphanum()
        .messages(changeNameErrorMessages('First name')),
    lastName: Joi.string()
        .required()
        .trim()
        .min(3).max(128)
        .alphanum()
        .messages(changeNameErrorMessages('Last name')),
});

exports.changeNameValidation = (req, res, next) => {
    const { error, value } = changeNameSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
};