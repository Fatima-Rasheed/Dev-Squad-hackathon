const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // make sure path is correct

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect MongoDB
connectDB();

// CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', // ← add this
    'https://frontend-kohl-xi-83.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => res.json({ message: 'Tea API is running' }));

module.exports = app;