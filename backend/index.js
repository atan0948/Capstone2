const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const garmentsRoutes = require('./routes/garmentroutes');
const salesRoutes = require('./routes/sales');
const garmentFileUpload = require('./routes/garment_fileupload');
const verifyToken = require('./authmiddleware');
const db = require('./database/db');
const records = require('./routes/records');
const lowStockCount = require('./routes/dash');
const inventoryRoutes = require('./routes/inventory');
const inventoryChartRoutes = require('./routes/inventory_chart');
const inventoryExcelRoutes = require('./routes/excelformat');


dotenv.config();
const app = express();

// ✅ Enable CORS (for development)
app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control']
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
app.use('/api/sales', require('./routes/sales'));      // ✅ Handles /total-orders
app.use('/api/dashboard', require('./routes/dash'));   // ✅ Handles /low-stock

app.use('/api/records', records);

// ✅ Existing Inventory Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/inventory', inventoryChartRoutes);
app.use('/api/inventory', inventoryExcelRoutes);


// ✅ Route for exporting inventory report to Excel (corrected)
app.use('/api/inventory', inventoryExcelRoutes); // Ensure this is correctly used as a router

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

// Route: GET /api/defects/today
app.get('/api/defects/today', async (req, res) => {
    const query = `SELECT COUNT(*) AS defectCount 
                   FROM garments 
                   WHERE status = 'Defective' 
                   AND DATE(date_added) = CURDATE()`;

    try {
        const [rows] = await db.execute(query);
        res.json({ defectCount: rows[0].defectCount });
    } catch (err) {
        console.error('Error fetching today\'s defect count:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
