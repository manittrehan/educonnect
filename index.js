const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*', // Restrict to specific origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const mongoURI = "mongodb://localhost:27017/educonnects";

// Enhanced MongoDB Connection Event Handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  // Additional error logging or notification system
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB Atlas");
});

// Connect to MongoDB with improved error handling
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (err) {
    console.error("Initial MongoDB connection error:", err);
    // More sophisticated retry mechanism
    setTimeout(connectDB, 5000);
  }
};

// User Schema with password hashing
const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Pre-save hook for password hashing
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has be// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*', // Restrict to specific origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const mongoURI = "mongodb://localhost:27017/educonnects"; // Local MongoDB Compass URI

// MongoDB Connection Event Handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Compass");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB Compass");
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("Initial MongoDB connection error:", err);
    setTimeout(connectDB, 5000); // Retry connection
  }
};

// User Schema (Existing Functionality)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook for password hashing
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

// Support Schema (New Functionality)
const SupportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Support = mongoose.model("Support", SupportSchema);

// Contact Support API (Save to MongoDB)
app.post("/api/support", async (req, res) => {
  const { name, email, issueType, description } = req.body;

  if (!name || !email || !issueType || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const supportQuery = new Support({ name, email, issueType, description });
    await supportQuery.save();
    res.status(201).json({ message: "Support query submitted successfully" });
  } catch (err) {
    console.error("Error saving support query:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Support Queries for FAQ
app.get("/api/support", async (req, res) => {
  try {
    const supportQueries = await Support.find().sort({ createdAt: -1 });
    res.json(supportQueries);
  } catch (err) {
    console.error("Error fetching support queries:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
en modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

// Login Route with enhanced security
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find user by username
    const user = await User.findOne({ username });
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Successful login
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Signup Route with validation
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  // Enhanced input validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Rest of your existing routes...

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});