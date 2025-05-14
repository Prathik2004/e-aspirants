const express = require("express");
const cors = require("cors");
const connectDB = require("./connection/connection");
const authorizationschema = require("./models/authorization");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Middleware to protect routes
const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, "secret_key");
        req.user = await authorizationschema.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Signup Route
app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name);
    try {
        const exist = await authorizationschema.findOne({ email });
        if (exist) return res.status(400).json({ message: "User already exists" });
        const hashed = await bcrypt.hash(password, 10);
        const user = await authorizationschema.create({ name, email, password: hashed });
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authorizationschema.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1d" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Cart (protected)
app.get("/api/cart", protect, async (req, res) => {
    res.json({ cart: req.user.cart });
});

// Update Cart (protected)
app.post("/api/cart", protect, async (req, res) => {
    req.user.cart = req.body.cart;
    await req.user.save();
    res.json({ message: "Cart updated" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));