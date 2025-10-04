const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove categories without group assignment (old format)
    const result = await Category.deleteMany({ group: { $exists: false } });
    console.log(`✓ Removed ${result.deletedCount} orphaned categories`);

    console.log('✓ Database cleanup complete!');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

if (require.main === module) {
  cleanup();
}

module.exports = cleanup;