const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from the specified .env file (or default to .env)
dotenv.config({ path: process.env.ENV_FILE || '.env' });

// Debug: Print important environment variables to verify they are loaded
console.log('[DEBUG] ENV_FILE:', process.env.ENV_FILE);
console.log('[DEBUG] MONGO_URI:', process.env.MONGO_URI || process.env.MONGODB_URI);
console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

const app = express();

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed from this origin'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
const jobRoutes = require('./routes/jobs');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);

// Health check route
app.get('/', (req, res) => res.send('API Running'));

// HTTPS Options
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || './server.key'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || './server.cert'),
};

// Start server
const PORT = process.env.PORT || 5001;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});