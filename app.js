const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const userRoutes = require('./routes/users')
app.use('/api/users', userRoutes);
//app.use('/api/jobs', require('./routes/jobs'));
//app.use('/api/applications', require('./routes/applications'));

// Health check route
app.get('/', (req, res) => res.send('API Running'));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));