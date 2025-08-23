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

app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.url);
  next();
});

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



// Start server with HTTPS or HTTP fallback
const PORT = process.env.PORT || 5001;
try {
  const keyPath = process.env.SSL_KEY_PATH || './server.key';
  const certPath = process.env.SSL_CERT_PATH || './server.cert';
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`HTTPS Server running on port ${PORT}`);
    });
  } else {
    app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`));
  }
} catch (e) {
  console.error('HTTPS failed, falling back to HTTP:', e.message);
  app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`));
}