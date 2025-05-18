const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const taskRoutes = require('./routes/taskRoutes'); // <-- Import task routes
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

// Replace with your actual secret in environment variables for production
const JWT_SECRET = process.env.JWT_SECRET;


// CORS configuration (adjust the origin for production)
app.use(cors({
  origin: [
    'http://localhost:3000', // for development
    'https://tasklist-frontend.onrender.com', // for deployed frontend
    'https://tasklist-nodejs-tasklist-frontend.onrender.com',
  ],
  credentials: true,
}));

app.use(express.json()); // Parse JSON bodies

// MongoDB connection string (should be stored in env vars in production)
const mongoURI = process.env.MONGO_URI;
// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ---------------------
// Mongoose User Schema
// ---------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// ------------------
// Register Endpoint
// ------------------
app.post('/api/users/signup', async (req, res) => {
  const { name, email, password, country } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, country });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ----------------
// Login Endpoint
// ----------------
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ------------------------
// Auth Middleware
// ------------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Token is not valid' });
    req.user = decoded;
    next();
  });
};

// -----------------------------
// Protected Route Example
// -----------------------------
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    msg: 'This is protected data',
    user: req.user
  });
});



// -----------------------------
// Mount Task Routes
// -----------------------------
app.use('/api/tasks', taskRoutes); // <-- Use task API routes

// --------------------
// Start the Server
// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
