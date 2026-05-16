// Centralizing env vars prevents typos and gives you one place to validate them
// If a required env var is missing, the app crashes at startup — better than runtime failures

import process from "process";

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GROQ_API_KEY',
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  groqApiKey: process.env.GROQ_API_KEY!,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  validateEnv,
};