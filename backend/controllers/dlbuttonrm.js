const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const db = require("../database/db"); // Ensure correct database connection

const fetchInventoryData = async (start, end) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, item_name, category, size, color, quantity, price, supplier, location, date_added 
            FROM inventory
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

        // ✅ Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Inventory Report");

        // ✅ Define columns with headers
        worksheet.columns = [
            { header: "ID", key: "id", width: 5 },
            { header: "Item Name", key: "item_name", width: 20 },
            { header: "Category", key: "category", width: 15 },
            { header: "Size", key: "size", width: 10 },
            { header: "Color", key: "color", width: 10 },
            { header: "Quantity", key: "quantity", width: 10 },
            { header: "Price", key: "price", width: 15 },
            { header: "Supplier", key: "supplier", width: 20 },
            { header: "Location", key: "location", width: 20 },
            { header: "Date Added", key: "date_added", width: 15 }
        ];

        // ✅ Add data rows
        inventoryData.forEach(item => {
            worksheet.addRow(item);
        });

        // ✅ Apply styles to the header row
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFCC00" } // Yellow header
            };
            cell.alignment = { horizontal: "center" };
        });

        // ✅ Apply border styles to all cells
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });
        });

        console.log("✅ Workbook created with styled sheet:");
console.log(workbook);
 

        // ✅ Write file to memory and send as response
        const filePath = path.join(__dirname, `inventory_report_${start}_to_${end}.xlsx`);
        await workbook.xlsx.writeFile(filePath);

        res.download(filePath, (err) => {
            if (err) {
                console.error("❌ File download error:", err);
            }
            // Delete file after sending
            fs.unlink(filePath, (err) => {
                if (err) console.error("❌ Error deleting file:", err);
            });
        });

    } catch (error) {
        console.error("❌ Error exporting inventory report:", error);
        res.status(500).json({ error: "Failed to export inventory report." });
    }
};

module.exports = { exportInventoryReport };
