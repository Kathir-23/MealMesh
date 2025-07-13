import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Improved connection with error handling
let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Add more connection options for better stability
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      family: 4  // Force IPv4
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit process in production - allows Vercel to handle errors
    throw error; // Propagate error for handling
  }
};

export default mongoose;

// Export models directly
export { default as User } from './models/User.js';
export { default as Donation } from './models/Donation.js';
export { default as Organization } from './models/Organization.js';
export { default as Contact } from './models/Contact.js';