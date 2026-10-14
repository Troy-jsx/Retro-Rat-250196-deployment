const User = require('../models/User'); // Import the schema
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    // Frontend sends the string representation of the notes
    const { username, email, musicalSequence } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    // Hash the musical sequence (Note: Salt rounds = 10 is industry standard)
    const salt = await bcrypt.genSalt(10);
    const hashedSequence = await bcrypt.hash(musicalSequence, salt);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      musicalHash: hashedSequence
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error during signup" });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, musicalSequence } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare the user's musical string with the stored hash
    const isMatch = await bcrypt.compare(musicalSequence, user.musicalHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate the JWT 
    // REMEMBER BABES!!!: process.env.JWT_SECRET is a secret key that must be set in the .env file
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ token, message: "Login successful" });

  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};