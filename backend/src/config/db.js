import mongoose from 'mongoose';

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MainDb';
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
};
