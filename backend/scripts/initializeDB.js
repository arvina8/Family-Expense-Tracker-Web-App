const mongoose = require('mongoose');
const User = require('../models/User');
const Group = require('../models/Group');
const Category = require('../models/Category');
require('dotenv').config();

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found. Creating sample users...');
      
      const defaultUsers = [
        { name: 'Alice Johnson', email: 'alice@example.com', password: 'defaultpass123' },
        { name: 'Bob Smith', email: 'bob@example.com', password: 'defaultpass123' },
        { name: 'Charlie Brown', email: 'charlie@example.com', password: 'defaultpass123' },
        { name: 'Dana White', email: 'dana@example.com', password: 'defaultpass123' }
      ];

      await User.insertMany(defaultUsers);
      console.log('✓ Sample users created');
    } else {
      console.log(`✓ Found ${userCount} existing users`);
    }

    console.log('\n🎉 Database initialization complete!');
    console.log('Your Group Expense Tracker backend is ready to use.');
    console.log('\n📝 To get started:');
    console.log('1. Register a new account or login with sample users');
    console.log('2. Create a group or join an existing one');
    console.log('3. Add categories and start tracking expenses');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
