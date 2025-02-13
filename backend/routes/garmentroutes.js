const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Ensure this file correctly exports your database connection

// ✅ Get all garments
router.get('/', async (req, res) => {
    try {
        const [garments] = await db.query('SELECT * FROM garments');
        res.json(garments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch garments' });
    }
});

// ✅ Add a new garment
router.post('/', async (req, res) => {
    const { item_name, quantity, price, supplier } = req.body;
    try {
        await db.query('INSERT INTO garments (item_name, quantity, price, supplier) VALUES (?, ?, ?, ?)', 
            [item_name, quantity, price, supplier]);
        res.json({ message: 'Garment added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add garment' });
    }
});

// ✅ Update a garment
router.put('/:id', async (req, res) => {
    const { item_name, quantity, price, supplier } = req.body;
    const { id } = req.params;
    try {
        await db.query('UPDATE garments SET item_name=?, quantity=?, price=?, supplier=? WHERE id=?', 
            [item_name, quantity, price, supplier, id]);
        res.json({ message: 'Garment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update garment' });
    }
});

// ✅ Delete a garment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM garments WHERE id=?', [id]);
        res.json({ message: 'Garment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete garment' });
    }
});

module.exports = router;
