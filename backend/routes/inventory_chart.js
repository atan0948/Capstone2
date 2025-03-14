const express = require("express");
const router = express.Router();
const db = require("../database/db");

// 📌 New Route: Fetch inventory changes
router.get("/inventory-changes", async (req, res) => {
    try {
        const query = `
            SELECT DATE(date_added) as date, SUM(quantity) as total_quantity 
            FROM garments 
            GROUP BY DATE(date_added) 
            ORDER BY DATE(date_added) ASC;
        `;
        const [records] = await db.query(query);
        
        res.json(records);
    } catch (error) {
        console.error("❌ Error fetching inventory changes:", error);
        res.status(500).json({ error: "Failed to fetch inventory changes." });
    }
});

module.exports = router;
