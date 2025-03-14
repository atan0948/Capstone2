const express = require('express');
const router = express.Router();
const db = require('../database/db');
const excelJS = require('exceljs'); // Make sure you have this installed

router.get('/export', async (req, res) => {
    console.log("✅ Export route hit!");

    try {
        const query = `SELECT * FROM garments WHERE DATE(date_added) = ? OR date_added = ?`;
        const [records] = await db.promise().query(query, [formattedDate, formattedDate]);


        if (!records || records.length === 0) {
            return res.status(404).json({ error: 'No records found' });
        }

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Garments Report');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Item Name', key: 'item_name', width: 20 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Size', key: 'size', width: 10 },
            { header: 'Color', key: 'color', width: 15 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Price', key: 'price', width: 10 },
            { header: 'Cost Price', key: 'cost_price', width: 12 },
            { header: 'Supplier', key: 'supplier', width: 20 },
            { header: 'Location', key: 'location', width: 20 }
        ];

        worksheet.addRows(records);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=garments_report.xlsx");

        await workbook.xlsx.write(res);
        res.end();
        console.log("📂 Excel file generated and sent!");
    } catch (error) {
        console.error("❌ Error generating report:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
});

router.get('/report/:date', async (req, res) => {
    try {
        const selectedDate = req.params.date;
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

        const query = `SELECT * FROM garments WHERE DATE(date_added) = ?`;
        const [records] = await db.query(query, [formattedDate]);

        res.json(records);
    } catch (error) {
        console.error("❌ Error generating report:", error);
        res.status(500).json({ error: "Failed to generate report." });
    }
});


module.exports = router;
