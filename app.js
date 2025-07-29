const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const path = require('path');

dotenv.config({ path: process.env.ENV_FILE || '.env' });
connectDB();

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  'https://jobapp.vercel.app', // Production frontend
  'http://localhost:3000'      // Local development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true
};

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Core Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);
const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/', (req, res) => res.send('API Running'));

// HTTPS Options
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

const PORT = process.env.PORT || 5001;

// Start HTTPS server
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});