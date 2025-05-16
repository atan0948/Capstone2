const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../database/db');

// ✅ Configure Image Upload with Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ✅ Get all garments
router.get('/', async (req, res) => {
    try {
        const [garments] = await db.query('SELECT * FROM garments');
        res.json(garments);
    } catch (error) {
        console.error("❌ Error fetching garments:", error);
        res.status(500).json({ error: 'Failed to fetch garments' });
    }
});

// ✅ Add a new garment
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("📩 Incoming Request Body:", req.body);
        console.log("📸 Uploaded File:", req.file);

        const { item_name, category, size, color, quantity, price, cost_price, supplier, location, status } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        if (!item_name || !category || !size || !color || !quantity || !price || !supplier) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const query = `INSERT INTO garments (item_name, category, size, color, quantity, price, cost_price, supplier, location, image_url, status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [item_name, category, size, color, quantity, price, cost_price || 0, supplier, location, imageUrl, status];

        console.log("📝 Executing Query:", query);
        console.log("📊 With Values:", values);

        const [result] = await db.query(query, values);
        console.log("✅ Insert Result:", result);

        res.json({ message: "Garment added successfully", imageUrl });
    } catch (error) {
        console.error("❌ Error adding garment:", error);
        res.status(500).json({ error: "Failed to add garment" });
    }
});

// ✅ Update a garment
router.put('/:id', async (req, res) => {
    console.log("📩 Update request received:", req.body);

    const { item_name, quantity, price, supplier, status } = req.body;
    const { id } = req.params;

    if (!item_name || !quantity || !price || !supplier) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const [result] = await db.query(
            "UPDATE garments SET item_name=?, quantity=?, price=?, supplier=?, status=? WHERE id=?",
            [item_name, quantity, parseFloat(price), supplier, status, id]        
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Garment not found." });
        }

        res.json({ message: "Garment updated successfully!" });
    } catch (error) {
        console.error("❌ Error updating garment:", error);
        res.status(500).json({ error: "Failed to update garment." });
    }
});

// ✅ Delete a garment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM garments WHERE id=?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Garment not found." });
        }
        res.json({ message: 'Garment deleted successfully' });
    } catch (error) {
        console.error("❌ Error deleting garment:", error);
        res.status(500).json({ error: 'Failed to delete garment' });
    }
});

// Get a single garment by ID
router.get('/:id', async (req, res) => {
    const garmentId = req.params.id;

    try {
        const [rows] = await db.execute('SELECT * FROM garments WHERE id = ?', [garmentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Garment not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching garment by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
