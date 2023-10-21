const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "You must be logged in to access this page!" });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: 'Not Authorized. Token has been manipulated' });
    }
    if (!decoded) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    req.user = decoded;
    next();
};