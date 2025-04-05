const express = require('express');
const router = express.Router();
const { exportInventoryReport } = require('../controllers/dlbuttonrm'); // Import the correct controller

// ✅ Define the route properly
router.get('/export', exportInventoryReport);

module.exports = router;
