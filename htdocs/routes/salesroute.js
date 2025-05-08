router.get('/sales/date-range', async (req, res) => {
    const { from, to } = req.query;
    try {
        const [rows] = await db.execute(`
            SELECT 
                sales.id,
                garments.item_name,
                sales.quantity_sold,
                sales.total,
                sales.customer_name,
                sales.payment_type,
                sales.sale_date
            FROM sales
            JOIN garments ON sales.item_id = garments.id
            WHERE sales.sale_date BETWEEN ? AND ?
            ORDER BY sales.sale_date DESC
        `, [from, to]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
