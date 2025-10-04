const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
require('dotenv').config();

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
  console.log('No users found. Creating sample group users...');
      
      const defaultUsers = [
        { name: 'Alice', email: 'alice@example.com', password: 'defaultpass123' },
        { name: 'Bob', email: 'bob@example.com', password: 'defaultpass123' },
        { name: 'Charlie', email: 'charlie@example.com', password: 'defaultpass123' },
        { name: 'Dana', email: 'dana@example.com', password: 'defaultpass123' }
      ];

      await User.insertMany(defaultUsers);
  console.log('✓ Sample users created');
    } else {
  console.log(`✓ Found ${userCount} existing users`);
    }

    // Check if categories already exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('No categories found. Creating default categories...');
      
      const defaultCategories = [
        { name: 'Food & Dining' },
        { name: 'Transportation' },
        { name: 'Utilities' },
        { name: 'Entertainment' },
        { name: 'Healthcare' },
        { name: 'Shopping' },
        { name: 'Education' },
        { name: 'Travel' },
        { name: 'Home & Garden' },
        { name: 'Other' }
      ];

      await Category.insertMany(defaultCategories);
      console.log('✓ Default categories created');
    } else {
      console.log(`✓ Found ${categoryCount} existing categories`);
    }

    console.log('\n🎉 Database initialization complete!');
  console.log('Your Group Expense Tracker backend is ready to use.');
    
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
