require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Create a test user
    const testUser = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    // Save the test user
    const savedUser = await testUser.save();
    console.log('Test user created successfully:', savedUser._id);

    // Find the user
    const foundUser = await User.findOne({ username: 'testuser' });
    console.log('Found user:', {
      id: foundUser._id,
      name: foundUser.name,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role
    });

    // Delete the test user
    await User.deleteOne({ username: 'testuser' });
    console.log('Test user deleted successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testDatabase(); 