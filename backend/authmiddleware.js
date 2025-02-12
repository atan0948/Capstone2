const jwt = require('jsonwebtoken');
const secretKey = 'b14f3a8c9d6e7f0g1h2i3j4k5l6m7n8o'; // Use the same secret key from login

function verifyToken(req, res, next) {
    const token = req.headers.authorization; // Get token from headers

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token." });
        }

        req.user = decoded; // Store user data from token
        next(); // Continue to the protected route
    });
}

module.exports = verifyToken;
