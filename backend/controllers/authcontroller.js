const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db'); // ✅ Import updated db.js

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // ✅ Use `await db.query()`, no `.promise()`
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = rows[0];

        // ✅ Compare the password entered with the hashed password in the database
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // ✅ Generate a JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET, // Use secret from .env
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { login };
