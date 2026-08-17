require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect, authorize } = require('./middleware/auth');
require('./config/mqtt');

connectDB();
const app = express();

const http = require('http');
const server = http.createServer(app);
// Initialize Socket.IO
const {initSocket} = require('./socket/socket');
const socketHandler = require('./socket/socketHandler');
const io = initSocket(server);
socketHandler(io);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow cookies to be sent
  })
);

app.use('/api/auth', authRoutes);

// Example protected route
app.get('/api/protected/dashboard', protect, (req, res) => {
  res.json({ success: true, message: `Welcome ${req.user.name}, this is protected data.` });
});

// Example admin-only route
app.get('/api/protected/admin', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Welcome to the admin panel.' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
