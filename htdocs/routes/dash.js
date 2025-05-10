const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/low-stock', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT category, COUNT(*) AS count
            FROM garments
            WHERE quantity <= 5
            GROUP BY category
        `);

        res.json({ categories: rows });
        console.log({ categories: rows });
    } catch (error) {
        console.error('Error fetching low stock items by category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
