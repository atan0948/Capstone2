const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const garmentsRoutes = require('./routes/garmentroutes');
const salesRoutes = require('./routes/sales'); 
const garmentFileUpload = require('./routes/garment_fileupload'); // ✅ Renamed for clarity
const verifyToken = require('./authmiddleware');
const db = require('./database/db');
const records = require('./routes/records');

dotenv.config();
const app = express();

// ✅ Enable CORS (for development)
app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// ✅ Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Needed for form-data

// ✅ Authentication routes
app.use('/api', authRoutes);

// ✅ Garment CRUD routes
app.use('/api/garments', garmentsRoutes);

// ✅ Garment file upload routes
app.use('/api/garments/upload', garmentFileUpload); // ✅ Moved to `/api/garments/upload`

// ✅ Sales routes
app.use('/api', salesRoutes);

app.use('/api/records', records);

// ✅ Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// ✅ Protected route (using middleware)
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

// ✅ Ensure Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
    connection.release();
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
