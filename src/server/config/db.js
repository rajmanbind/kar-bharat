
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string would typically come from environment variables
    // For development, you can use a local MongoDB instance
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/labor_marketplace');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
