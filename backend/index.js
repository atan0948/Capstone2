const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const garmentsRoutes = require('./routes/garmentroutes'); // Import the garments route
const verifyToken = require('./authmiddleware'); // Import auth middleware
const db = require('./database/db'); // Import your database connection

dotenv.config();
const app = express();

// ✅ Enable CORS (for development)
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Adjust based on your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON request bodies

// ✅ Use authentication routes
app.use('/api', authRoutes);

// ✅ Use garments routes
app.use('/api/garments', garmentsRoutes);

// ✅ Protected route example (using middleware)
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
