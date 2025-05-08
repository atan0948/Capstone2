const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Your DB connection

// ✅ Add a sale and deduct inventory   
router.post('/', async (req, res) => {
    const { item_id, quantity_sold, payment_type, customer_name } = req.body;

    if (!item_id || !quantity_sold || quantity_sold <= 0) {
        return res.status(400).json({ error: 'Item ID and valid quantity sold are required' });
    }

    try {
        // 1. Fetch item to get stock and price
        const [items] = await db.execute('SELECT quantity, price FROM garments WHERE id = ?', [item_id]);

        if (items.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const item = items[0];

        if (item.quantity < quantity_sold) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        const total = item.price * quantity_sold;

        // 2. Update garment stock
        await db.execute('UPDATE garments SET quantity = quantity - ? WHERE id = ?', [quantity_sold, item_id]);

        // 3. Insert into sales table
        await db.execute(
            `INSERT INTO sales (item_id, quantity_sold, total, sale_date, payment_type, customer_name)
             VALUES (?, ?, ?, NOW(), ?, ?)`,
            [item_id, quantity_sold, total, payment_type, customer_name]
        );

        res.status(201).json({ message: 'Sale recorded and inventory updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get all sales with item details
router.get('/', async (req, res) => {
    try {
        const [sales] = await db.execute(`
            SELECT 
                sales.id,
                garments.item_name,
                garments.price,
                sales.quantity_sold,
                sales.total,
                sales.payment_type,
                sales.customer_name,
                sales.sale_date
            FROM sales 
            JOIN garments ON sales.item_id = garments.id 
            ORDER BY sales.sale_date DESC
        `);

        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Route to get total number of sales orders
router.get('/total-orders', async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) AS total FROM sales');
        res.json({ total: result[0].total });
    } catch (error) {
        console.error('❌ Error fetching total sales orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// routes/sales.js
router.get('/search', async (req, res) => {
    const { query } = req.query; // Getting the query parameter from the URL

    try {
        const [results] = await db.execute(`
            SELECT s.id, s.item_name, s.quantity, s.sale_date, s.total_price
            FROM sales s
            WHERE s.item_name LIKE ? OR s.sale_date LIKE ?
        `, [`%${query}%`, `%${query}%`]);

        res.json(results);
    } catch (err) {
        console.error('Error searching sales records:', err);
        res.status(500).json({ error: 'Failed to search sales records.' });
    }
});


module.exports = router;
