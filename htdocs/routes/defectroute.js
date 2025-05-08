// Route: GET /api/defects/today
app.get('/api/defects/today', async (req, res) => {
    const query = `SELECT COUNT(*) AS defectCount 
                   FROM garments 
                   WHERE status = 'Defective' 
                   AND DATE(date_added) = CURDATE()`;

    try {
        const [rows] = await db.execute(query);
        res.json({ defectCount: rows[0].defectCount });
    } catch (err) {
        console.error('Error fetching today\'s defect count:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
