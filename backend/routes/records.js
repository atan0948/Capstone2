const express = require('express');
const router = express.Router();
const db = require('../database/db');
const excelJS = require('exceljs');

// 📂 Export today's garments (you can expand this for range later)
router.get('/export', async (req, res) => {
    try {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];    

        const query = `SELECT * FROM garments WHERE DATE(date_added) = ?`;
        const [records] = await db.promise().query(query, [formattedDate]);

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

// 📅 Get garments for a specific date
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

// 📆 Get garments & sales between date range
router.get('/report', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end dates are required' });
    }

    try {
        const inventoryQuery = `
            SELECT * FROM garments 
            WHERE DATE(date_added) BETWEEN ? AND ?
        `;
        const salesQuery = `
            SELECT sales.id, garments.item_name, sales.quantity_sold, sales.total, 
                   sales.customer_name, sales.payment_type, sales.sale_date
            FROM sales 
            JOIN garments ON sales.item_id = garments.id
            WHERE DATE(sale_date) BETWEEN ? AND ?
        `;

        const [inventory] = await db.query(inventoryQuery, [start, end]);
        const [sales] = await db.query(salesQuery, [start, end]);


        res.json({ inventory, sales }); // 👈 Send both
    } catch (error) {
        console.error("❌ Error fetching report by date range:", error);
        res.status(500).json({ error: "Failed to fetch report data." });
    }
});

router.get('/export-inventory-range', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end dates are required' });
    }

    try {
        const query = `
            SELECT * FROM garments 
            WHERE DATE(date_added) BETWEEN ? AND ?
        `;
        const [inventory] = await db.query(query, [start, end]);

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Report');

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
            { header: 'Location', key: 'location', width: 20 },
            { header: 'Date Added', key: 'date_added', width: 20 }
        ];

        worksheet.addRows(inventory);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=inventory_${start}_to_${end}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("❌ Error exporting inventory report:", error);
        res.status(500).json({ error: "Failed to export inventory report." });
    }
});

router.get('/export-sales-range', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end dates are required' });
    }

    try {
        const query = `
            SELECT sales.id, garments.item_name, sales.quantity_sold, sales.total, 
                   sales.customer_name, sales.payment_type, sales.sale_date
            FROM sales 
            JOIN garments ON sales.item_id = garments.id
            WHERE DATE(sale_date) BETWEEN ? AND ?
        `;
        const [sales] = await db.query(query, [start, end]);

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        worksheet.columns = [
            { header: 'Sale ID', key: 'id', width: 10 },
            { header: 'Item Name', key: 'item_name', width: 20 },
            { header: 'Quantity Sold', key: 'quantity_sold', width: 15 },
            { header: 'Total (₱)', key: 'total', width: 12 },
            { header: 'Customer', key: 'customer_name', width: 20 },
            { header: 'Payment Type', key: 'payment_type', width: 15 },
            { header: 'Sale Date', key: 'sale_date', width: 20 }
        ];

        worksheet.addRows(sales);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=sales_${start}_to_${end}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("❌ Error exporting sales report:", error);
        res.status(500).json({ error: "Failed to export sales report." });
    }
});


module.exports = router;
