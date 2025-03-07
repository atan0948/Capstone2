const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Ensure this is your database connection file

// Add a sale and deduct inventory
router.post('/sales', async (req, res) => {
    const { item_id, quantity_sold } = req.body;

    if (!item_id || !quantity_sold) {
        return res.status(400).json({ error: 'Item ID and quantity sold are required' });
    }

    try {
        // Check if the item exists and get its current quantity
        const [item] = await db.query('SELECT quantity FROM garments WHERE id = ?', [item_id]);

        if (!item || item.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (item[0].quantity < quantity_sold) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Deduct the quantity from inventory
        await db.query('UPDATE garments SET quantity = quantity - ? WHERE id = ?', [quantity_sold, item_id]);

        // Insert into sales table
        await db.query('INSERT INTO sales (item_id, quantity_sold) VALUES (?, ?)', [item_id, quantity_sold]);

        res.json({ message: 'Sale recorded and inventory updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all sales with item details
router.get('/sales', async (req, res) => {
    try {
        const sales = await db.query(`
            SELECT sales.id, garments.item_name, sales.quantity_sold, sales.sale_date 
            FROM sales 
            JOIN garments ON sales.item_id = garments.id 
            ORDER BY sales.sale_date DESC
        `);

        res.json(sales[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
