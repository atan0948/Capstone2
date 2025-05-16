const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// ✅ Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control']
}));

// ✅ Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route imports (AFTER app is defined)
const authRoutes = require('./routes/authroutes');
const garmentsRoutes = require('./routes/garmentroutes');
const salesRoutes = require('./routes/sales');
const garmentFileUpload = require('./routes/garment_fileupload');
const db = require('./database/db');
const records = require('./routes/records');
const lowStockCount = require('./routes/dash');
const inventoryRoutes = require('./routes/inventory');
const inventoryChartRoutes = require('./routes/inventory_chart');

// ✅ Routes
app.use('/api', authRoutes);
app.use('/api/garments', garmentsRoutes);
app.use('/api/garments/upload', garmentFileUpload);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', lowStockCount);
app.use('/api/records', records);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/inventory', inventoryChartRoutes);
app.use('/uploads', express.static('uploads'));

// ✅ Auth middleware
const { verifyToken, requireAdmin, requireUser } = require('./authmiddleware');

// ✅ Defects route
app.get('/api/defects/today', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT COUNT(*) AS defectCount FROM garments WHERE status = 'Defective' AND DATE(date_added) = CURDATE()`
        );
        res.json({ defectCount: rows[0].defectCount });
    } catch (err) {
        console.error('Error fetching today\'s defect count:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Ensure database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
    connection.release();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running at http://0.0.0.0:${PORT}`));
