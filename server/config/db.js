import mongoose from 'mongoose';
import seedDatabase from '../utils/seedDatabase.js';

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/ar-genix-db';

    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');

    seedDatabase();
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;
