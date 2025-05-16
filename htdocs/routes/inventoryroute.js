const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Inventory Overview Endpoint
router.get('/current', async (req, res) => {
    try {
        if (!req.accepts('json')) {
            return res.status(406).json({ error: 'API only serves JSON' });
        }

        const [totalInventory] = await db.execute(`
            SELECT COALESCE(SUM(quantity), 0) AS total_quantity
            FROM garments
        `);

        const [categories] = await db.execute(`
            SELECT 
                COALESCE(category, 'uncategorized') AS category, 
                COALESCE(SUM(quantity), 0) AS category_quantity
            FROM garments
            GROUP BY category
            ORDER BY category_quantity DESC
        `);

        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            data: {
                totalQuantity: totalInventory[0].total_quantity,
                categories
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching inventory overview:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;