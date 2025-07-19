const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const multer = require('multer');

require('dotenv').config();
const { getCloudinaryStorage } = require('./config/cloudinary');

const connectDB = require('./connection/connection');
const User = require('./models/authorization');
const authMiddleware = require('./middleware/authMiddleware');
const Booklisting = require('./models/Booklisting');
const Order = require('./models/Order');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = ['http://localhost:5173','https://e-aspirants-1.vercel.app/'];
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null,true);
    cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Serve uploaded images statically
app.use(cookieParser());

const bookUpload = multer({ storage: getCloudinaryStorage('booklistings') });
const profileUpload = multer({ storage: getCloudinaryStorage('profile-pics') });


app.post('/api/sell-book', bookUpload.single('productPhoto'), async (req, res) => {
  try {
      // 1) req.body contains all your text fields
      const bookData = { ...req.body };

      // 2) ensure we got a file
      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'Product photo is required' });
      }

      // 3) multer-storage-cloudinary gives you the hosted URL
      //    and the public_id for future deletes
      bookData.productPhoto = req.file.path;          // e.g. https://res...
      bookData.photoPublicId = req.file.filename || req.file.public_id;    // e.g. book-covers/123abc

      // 4) save to Mongo
      const newBook = new Booklisting(bookData);
      await newBook.save();

      // 5) return the full document (incl. photo URL)
      res.status(201).json(newBook);
    } catch (error) {
      console.error('Error saving book:', error);
      res.status(500).json({ error: 'Failed to list book' });
    }
  }
);


// Signup route
app.post('/api/signup', profileUpload.single('profilePhoto'), async (req, res) => {
  const { name, email, password, number, address } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      number,
      address,
      profilePhoto: req.file ? req.file.path : '', // ✅ Save Cloudinary image URL
      cart: [],
    });

    await newUser.save();

    res.status(201).json({ message: 'Signup successful', user: { name, email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Failed to register user' });
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

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: 'Login successful',
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


app.get('/api/books', async (req, res) => {
  try {
    const books = await Booklisting.find(); // fetch all books
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

app.post('/api/place-order', authMiddleware, async (req, res) => {
  try {
    const { address, paymentMethod, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.map((item) => ({
      productId: item._id,
      productName: item.productName,
      productCost: item.productCost,
      quantity: item.quantity || 1,
      productPhoto: item.productPhoto, // 👈 ADD THIS LINE
    }));


    const totalAmount = items.reduce(
      (sum, item) => sum + item.productCost * item.quantity,
      0
    );

    const newOrder = new Order({
      user: req.user.id,
      items,
      address,
      paymentMethod,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});


// Get user profile route
app.get('/api/user', authMiddleware, async (req, res) => {
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

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // OPTIONAL: Use nodemailer to send an email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'prathik1611@gmail.com',
      pass: 'ifys gvty skru dhnb'
    }
  });

  const mailOptions = {
    from: email,
    to: 'prathik1611@gmail.com',
    subject: `Message from ${name}`,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get orders for the logged-in user
app.get('/api/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ orderedAt: -1 })
      .populate('items.productId', 'productName productPhoto productCost'); // 👈 Populating these fields

    res.status(200).json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id
app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.id)
      return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/api/user/profile', authMiddleware, profileUpload.single('profilePhoto'), async (req, res) => {
  try {
    const { name, email, number, address } = req.body;
    const updateData = { name, email, number, address };

    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.post('/update-tracking/:orderId', async (req, res) => {
  console.log('Incoming tracking update:', req.body);

  const { trackingId, courierName, status, location, lat, lng } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (trackingId) order.trackingId = trackingId;
    if (courierName) order.courierName = courierName;
    if (status) order.trackingStatus = status;

    if (status && location) {
      order.trackingHistory.push({
        status,
        location,
        timestamp: new Date()
      });
    }

    // 💡 Check lat/lng only if they are defined AND valid
    const parsedLat = lat !== '' ? parseFloat(lat) : null;
    const parsedLng = lng !== '' ? parseFloat(lng) : null;

    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      order.deliveryCoordinates = { lat: parsedLat, lng: parsedLng };
    }

    await order.save();
    res.status(200).json({ message: 'Tracking updated successfully', order });

  } catch (err) {
    console.error('Tracking update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/all-orders
app.get('/api/all-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderedAt: -1 })
      .populate('user', 'name email'); // adjust fields
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500)
     .json({ error: err.message || 'Internal Server Error' });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
