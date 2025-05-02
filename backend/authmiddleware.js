const jwt = require('jsonwebtoken');
const secretKey = 'b14f3a8c9d6e7f0g1h2i3j4k5l6m7n8o'; // Ideally use process.env.JWT_SECRET

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach user info (id, username, role) to request
        next();
    } catch (err) {
        return res.status(400).json({ error: "Invalid token." });
    }
}

// ✅ Optional: Middleware to restrict to admins only
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
}

// ✅ Optional: Middleware to restrict to users only
function requireUser(req, res, next) {
    if (req.user.role !== 'user') {
        return res.status(403).json({ error: "Access denied. Users only." });
    }
    next();
}

module.exports = {
    verifyToken,
    requireAdmin,
    requireUser
};
