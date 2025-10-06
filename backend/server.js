require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.length > 0
  ? { origin: allowedOrigins, credentials: true }
  : { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI environment variable.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Authentication tokens may not be secure.');
}

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10
})
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
