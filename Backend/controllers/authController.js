const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, username, email, password, role } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: role || 'user'
    });

    // Save user to database
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);

    // Generate token
    const token = generateToken(savedUser._id);

    // Send response
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ 
      username: username.toLowerCase() 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      error: error.message 
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.json(req.user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
}; 