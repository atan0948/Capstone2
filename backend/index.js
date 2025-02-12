const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/authroutes');

dotenv.config(); // Load environment variables

const app = express();

// Enable CORS for all requests (for development purposes)
app.use(cors());

// If you want to allow only your frontend:
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON request bodies

// Add login route
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const verifyToken = require('./authmiddleware'); // Import middleware

const router = express.Router();

router.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

module.exports = router;
