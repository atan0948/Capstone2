const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

const exportInventoryReport = async (req, res) => {
    const { start, end } = req.query;
    const filename = `Inventory_Report_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, `../public/${filename}`);

    try {
        const [inventoryRows] = await db.query(
            `SELECT id, item_name, category, size, color, quantity, price, supplier, location, date_added
            FROM garments
            WHERE date_added BETWEEN ? AND ?`,
            [start, end]
        );

        const doc = new PDFDocument({ margin: 30 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Title
        doc.fontSize(18).font('Helvetica-Bold').text('Inventory Report', { align: 'center' });
        doc.moveDown(1);

        // Date range
        doc.fontSize(10).font('Helvetica').text(`From: ${start} To: ${end}`, { align: 'center' });
        doc.moveDown(2);

        // Table Header
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('ID', 50, doc.y);
        doc.text('Name', 100, doc.y);
        doc.text('Category', 200, doc.y);
        doc.text('Size', 300, doc.y);
        doc.text('Color', 350, doc.y);
        doc.text('Qty', 400, doc.y);
        doc.text('Price', 450, doc.y);
        doc.text('Supplier', 500, doc.y);
        doc.text('Location', 550, doc.y);
        doc.text('Date Added', 600, doc.y);
        doc.moveDown(1);

        // Table Content
        doc.fontSize(9).font('Helvetica');

        inventoryRows.forEach((item, index) => {
            doc.text(item.id, 50, doc.y);
            doc.text(item.item_name, 100, doc.y);
            doc.text(item.category, 200, doc.y);
            doc.text(item.size, 300, doc.y);
            doc.text(item.color, 350, doc.y);
            doc.text(item.quantity, 400, doc.y);
            doc.text(`₱${parseFloat(item.price).toFixed(2)}`, 450, doc.y);
            doc.text(item.supplier, 500, doc.y);
            doc.text(item.location, 550, doc.y);
            doc.text(new Date(item.date_added).toLocaleDateString(), 600, doc.y);
            doc.moveDown(0.5);
        });

        doc.end();

        stream.on('finish', () => {
            res.download(filePath, filename, err => {
                if (err) console.error("❌ Download error:", err);
                fs.unlink(filePath, () => {});
            });
        });
    } catch (err) {
        console.error("❌ Error generating PDF:", err);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

const exportSalesReport = async (req, res) => {
    const { start, end } = req.query;
    const filename = `Sales_Report_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, `../public/${filename}`);

    try {
        const [salesRows] = await db.query(
            `SELECT id, product_name, quantity_sold, total, customer_name, payment_type, sale_date
            FROM sales
            WHERE sale_date BETWEEN ? AND ?`,
            [start, end]
        );

        const doc = new PDFDocument({ margin: 30 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Title
        doc.fontSize(18).font('Helvetica-Bold').text('Sales Report', { align: 'center' });
        doc.moveDown(1);

        // Date range
        doc.fontSize(10).font('Helvetica').text(`From: ${start} To: ${end}`, { align: 'center' });
        doc.moveDown(2);

        // Table Header
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('ID', 50, doc.y);
        doc.text('Item', 100, doc.y);
        doc.text('Qty Sold', 200, doc.y);
        doc.text('Total', 300, doc.y);
        doc.text('Customer', 400, doc.y);
        doc.text('Payment Type', 500, doc.y);
        doc.text('Sale Date', 600, doc.y);
        doc.moveDown(1);

        // Table Content
        doc.fontSize(9).font('Helvetica');

        salesRows.forEach((sale, index) => {
            doc.text(sale.id, 50, doc.y);
            doc.text(sale.product_name, 100, doc.y);
            doc.text(sale.quantity_sold, 200, doc.y);
            doc.text(`₱${parseFloat(sale.total).toFixed(2)}`, 300, doc.y);
            doc.text(sale.customer_name || '-', 400, doc.y);
            doc.text(sale.payment_type || '-', 500, doc.y);
            doc.text(new Date(sale.sale_date).toLocaleString(), 600, doc.y);
            doc.moveDown(0.5);
        });

        doc.end();

        stream.on('finish', () => {
            res.download(filePath, filename, err => {
                if (err) console.error("❌ Download error:", err);
                fs.unlink(filePath, () => {});
            });
        });
    } catch (err) {
        console.error("❌ Error generating PDF:", err);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

module.exports = {
    exportInventoryReport,
    exportSalesReport,
};
