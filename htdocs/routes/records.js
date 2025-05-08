const express = require('express');
const router = express.Router();
const { exportInventoryReport } = require('../controllers/dlbuttonrm');

const db = require('../database/db');

router.get('/export-inventory-range', exportInventoryReport);
router.get('/report', async (req, res) => {
    const { start, end } = req.query;

    try {
        const query = `
            SELECT * 
            FROM garments
            WHERE date_added BETWEEN ? AND ?
        `;

        const [inventory] = await db.execute(query, [start, end]);

        // Similarly for sales data or other reports
        const [sales] = await db.execute('SELECT * FROM sales WHERE sale_date BETWEEN ? AND ?', [start, end]);

        res.json({ inventory, sales });
    } catch (err) {
        console.error('Error fetching report data:', err);
        res.status(500).json({ error: 'Error fetching report data' });
    }
});
module.exports = router;
