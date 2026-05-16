import mongoose from 'mongoose';
import { env } from './env';
import process from 'process';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);

    process.exit(1);
  }
}