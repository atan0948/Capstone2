const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../database/db");

const router = express.Router();

// ✅ Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// ✅ Handle Image Upload & Garment Data
router.post("/add", upload.single("image"), (req, res) => {
    const { item_name, category, size, color, quantity, price, cost_price, supplier, location } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Insert into MySQL Database
    const sql = `INSERT INTO garments (item_name, category, size, color, quantity, price, cost_price, supplier, location, image_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [item_name, category, size, color, quantity, price, cost_price, supplier, location, image_url], (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        console.log("✅ Garment added:", result);
        res.json({ message: "Garment added successfully!", image_url });
    });
});

module.exports = router;
