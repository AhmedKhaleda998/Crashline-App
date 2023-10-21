const joi = require('joi');

const postErrorMessages = (field) => ({
    'string.empty': `${field} cannot be an empty field`,
    'any.required': `${field} is a required field`,
    'string.base': `${field} should be a type of 'text'`,
    'string.max': `${field} is too long`,
});

const postSchema = joi.object({
    title: joi.string()
        .trim()
        .min(1).max(128)
        .messages(postErrorMessages('Title')),
    content: joi.string()
        .trim()
        .min(1).max(512)
        .messages(postErrorMessages('Content')),
    image: joi.optional().allow(null),
});

const requiredPostSchema = postSchema.required();

exports.postValidation = (req, res, next) => {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
};

exports.requiredPostValidation = (req, res, next) => {
    const { error, value } = requiredPostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
}


const commentErrorMessages = (field) => ({
    'string.empty': `${field} cannot be an empty field`,
    'any.required': `${field} is a required field`,
    'string.base': `${field} should be a type of 'text'`,
    'string.max': `${field} is too long`,
    'string.min': `${field} is too short`,
});

const commentSchema = joi.object({
    content: joi.string()
        .required()
        .trim()
        .min(1).max(512)
        .messages(commentErrorMessages('Content')),
});

exports.commentValidation = (req, res, next) => {
    const { error, value } = commentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedData = value;
    next();
};