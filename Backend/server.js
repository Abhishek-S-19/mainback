require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check if .env file exists
const envPath = path.resolve(process.cwd(), '.env');
console.log('Looking for .env file at:', envPath);

// MongoDB connection with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket-management';
console.log('Using MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Please make sure MongoDB is running and the connection string is correct');
    process.exit(1);
});

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/trainers', trainerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});


