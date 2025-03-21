router.get('/inventory/date-range', async (req, res) => {
    const { from, to } = req.query;
    try {
        const [rows] = await db.execute(
            `SELECT * FROM garments WHERE date_added BETWEEN ? AND ?`,
            [from, to]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
