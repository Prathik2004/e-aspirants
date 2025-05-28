const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');
const { Readable } = require('stream');

const connectDB = require('./connection/connection');
const User = require('./models/authorization');
const authMiddleware = require('./middleware/authMiddleware');
const Booklisting = require('./models/Booklisting');

require('dotenv').config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Connect to MongoDB
connectDB();

let gfsBucket;
mongoose.connection.once('open', () => {
  const db = mongoose.connection.db;
  gfsBucket = new GridFSBucket(db, { bucketName: 'uploads' });
  console.log('✅ GridFSBucket initialized');
});

// Middleware
app.use(cors({
  origin: 'https://e-aspirants.vercel.app', // ✅ replace with actual Vercel URL
  credentials: true
}));
app.use(express.json());

// Multer memory storage for GridFS upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password, number } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      number,
      cart: [],
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
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

// Sell book route with multer middleware to upload productPhoto to GridFS
app.post('/api/sell-book', upload.single('productPhoto'), async (req, res) => {
  try {
    const bookData = req.body;

    if (req.file) {
      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);

      const uploadStream = gfsBucket.openUploadStream(req.file.originalname);

      uploadStream.on('error', (error) => {
        console.error('GridFS upload error:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
      });

      uploadStream.on('finish', async () => {
        bookData.productPhoto = uploadStream.id.toString();

        const newBook = new Booklisting(bookData);
        await newBook.save();
        res.status(201).json({ message: 'Book listed successfully!' });
      });

      readableStream.pipe(uploadStream);
    } else {
      return res.status(400).json({ error: 'Product photo is required' });
    }
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Failed to list book' });
  }
});

// Get all books route
app.get('/api/books', async (req, res) => {
  try {
    const books = await Booklisting.find(); // fetch all books
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// Serve image from GridFS
app.get('/uploads/:id', (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);

    gfsBucket.find({ _id: fileId }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const file = files[0];
      res.set('Content-Type', file.contentType || 'application/octet-stream');

      const downloadStream = gfsBucket.openDownloadStream(fileId);

      downloadStream.on('error', () => {
        res.status(404).json({ error: 'File not found' });
      });

      downloadStream.pipe(res);
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid file id' });
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
