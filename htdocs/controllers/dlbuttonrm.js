const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../database/db");

const fetchInventoryData = async (start, end) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, item_name, category, size, color, quantity, price, supplier, location, date_added 
            FROM garments
            WHERE date_added BETWEEN ? AND ?
        `;
        db.query(query, [start, end], (err, results) => {
            if (err) {
                console.error("❌ Error fetching inventory data:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const exportInventoryReport = async (req, res) => {
    const { start, end } = req.query;

    try {
        const inventoryData = await fetchInventoryData(start, end);
        if (!inventoryData || inventoryData.length === 0) {
            return res.status(404).json({ message: "No inventory records found." });
        }

        
        const doc = new PDFDocument({ margin: 50 });
        
        const filePath = path.join(__dirname, `inventory_report_${start}_to_${end}.pdf`);
        
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(20).text("Inventory Report", { align: "center" });
        doc.moveDown(2);
        
        doc.fontSize(12).text(`From: ${start} To: ${end}`, { align: "center" });
        doc.moveDown(2);

        
        const headers = [
            "ID", "Item Name", "Category", "Size", "Color", "Quantity", "Price", "Supplier", "Location", "Date Added"
        ];

        doc.fontSize(10);
        
        // Draw headers
        headers.forEach((header, index) => {
            doc.text(header, 50 + (index * 80), doc.y);
        });

        // Add a separator line
        doc.moveDown();
        doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        // Loop through the data and add rows
        inventoryData.forEach((item, index) => {
            doc.text(item.id, 50, doc.y);
            doc.text(item.item_name, 130, doc.y);
            doc.text(item.category, 210, doc.y);
            doc.text(item.size, 290, doc.y);
            doc.text(item.color, 370, doc.y);
            doc.text(item.quantity, 450, doc.y);
            doc.text(item.price, 530, doc.y);
            doc.text(item.supplier, 610, doc.y);
            doc.text(item.location, 690, doc.y);
            doc.text(item.date_added, 770, doc.y);
            
            // Move to the next row
            doc.moveDown();
        });

        // Finalize the document
        doc.end();

        // Wait until the file is written before sending it
        doc.on('end', () => {
            res.download(filePath, (err) => {
                if (err) {
                    console.error("❌ File download error:", err);
                }
                
                fs.unlink(filePath, (err) => {
                    if (err) console.error("❌ Error deleting file:", err);
                });
            });
        });

    } catch (error) {
        console.error("❌ Error exporting inventory report:", error);
        res.status(500).json({ error: "Failed to export inventory report." });
    }
};

module.exports = { exportInventoryReport };
