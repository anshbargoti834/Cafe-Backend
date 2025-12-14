const dotenv = require('dotenv');
const path = require('path');

// Load .env file (it's okay if this fails on Render, as Render provides vars directly)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  
  // UPDATE 1: Added .trim() to remove accidental spaces (e.g., "site1.com, site2.com")
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim()),

  globalRateLimitWindowMs: parseInt(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS || '60000', 10),
  globalRateLimitMax: parseInt(process.env.GLOBAL_RATE_LIMIT_MAX || '120', 10),
  contactRateLimitWindowMs: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || '3600000', 10),
  contactRateLimitMax: parseInt(process.env.CONTACT_RATE_LIMIT_MAX || '5', 10),
  seatingLimitPerSlot: parseInt(process.env.SEATING_LIMIT_PER_SLOT || '20', 10),
  
  jwtSecret: process.env.JWT_SECRET_ADMIN || 'replace-me', // Make sure to set this in Render!

  EMAIL_HOST: process.env.EMAIL_HOST,
  // UPDATE 2: Port must be an integer for some libraries
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  
  // UPDATE 3: CRITICAL FIX! 
  // In .env, "false" is a string, which counts as true in JavaScript.
  // This forces it to be a real boolean.
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true', 
  
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL
};