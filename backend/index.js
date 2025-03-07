const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const garmentsRoutes = require('./routes/garmentroutes');
const salesRoutes = require('./routes/sales'); 
const verifyToken = require('./authmiddleware');
const db = require('./database/db');

dotenv.config();
const app = express();

// ✅ Enable CORS (for development)
app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON request bodies

// ✅ Use authentication routes
app.use('/api', authRoutes);

// ✅ Use garments routes
app.use('/api/garments', garmentsRoutes);

// ✅ Use sales routes
app.use('/api', salesRoutes);  // ✅ FIXED: Now sales API is properly structured

// ✅ Protected route (using middleware)
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

// ✅ Ensure Database Connection (if using MySQL)
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
    connection.release();
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
