import mongoose from 'mongoose';

const connectDB = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGO_URI not provided');

  try {
    // Ensure database name is included in URI
    const uri = mongoUri.includes('/?') ?
      mongoUri.replace('/?', '/habitapp?') :
      mongoUri;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

export default connectDB;
