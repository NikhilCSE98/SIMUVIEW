const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    try {
        const decoded = jwt.verify(token, jwt_key);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;
