
const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/current', async (req, res) => {
    try {
        const [totalInventory] = await db.execute(`
            SELECT SUM(quantity) AS total_quantity
            FROM garments
        `);

        const [categories] = await db.execute(`
            SELECT category, SUM(quantity) AS category_quantity
            FROM garments
            GROUP BY category
        `);

        res.json({
            totalQuantity: totalInventory[0].total_quantity,
            categories
        });
    } catch (error) {
        console.error('Error fetching inventory overview:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/inventory-changes', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT id, item_name, quantity, date_added
            FROM garments
            ORDER BY date_added DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching inventory changes:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        const [results] = await db.execute(`
            SELECT id, item_name, category, quantity, price
            FROM garments
            WHERE item_name LIKE ? OR category LIKE ?
        `, [`%${query}%`, `%${query}%`]);

        res.json(results);
    } catch (err) {
        console.error('Error searching inventory:', err);
        res.status(500).json({ error: 'Failed to search inventory items.' });
    }
});


module.exports = router;
