const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const connectDB = require('./connection/connection');
const User = require('./models/authorization');
const authMiddleware = require('./middleware/authMiddleware');
const Booklisting = require('./models/Booklisting');

require('dotenv').config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'https://e-aspirants.vercel.app', // ✅ replace with actual Vercel URL
  credentials: true
}));
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Upload folder (make sure it exists)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Signup route
// Signup route
app.post('/api/sell-book', upload.single('productPhoto'), async (req, res) => {
  try {
    const bookData = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Product photo is required' });
    }

    // Normalize path and set to bookData
    const normalizedPath = 'uploads' + req.file.filename;
    bookData.productPhoto = normalizedPath;

    const newBook = new Booklisting(bookData);
    await newBook.save();

    res.status(201).json({ message: 'Book listed successfully!' });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Failed to list book' });
  }
});



// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cart,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Sell book route with multer middleware to upload productPhoto
app.post('/api/sell-book', upload.single('productPhoto'), async (req, res) => {
  try {
    const bookData = req.body;
    if (req.file) {
      // Normalize the path to use forward slashes and prefix with /uploads/
      const normalizedPath = req.file.path.replace(/\\/g, '/'); // replaces backslashes with slashes
    } else {
      return res.status(400).json({ error: 'Product photo is required' });
    }

    const newBook = new Booklisting(bookData);
    await newBook.save();
    res.status(201).json({ message: 'Book listed successfully!' });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Failed to list book' });
  }
});


app.get('/api/books', async (req, res) => {
  try {
    const books = await Booklisting.find(); // fetch all books
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});



// Get user profile route
app.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Fetch user failed' });
  }
});

// Update cart route
app.put('/cart', authMiddleware, async (req, res) => {
  const { cart } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { cart }, { new: true });
    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
