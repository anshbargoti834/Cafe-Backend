const dotenv = require('dotenv');
const path = require('path');


dotenv.config({ path: path.resolve(process.cwd(), '.env') });


module.exports = {
port: process.env.PORT || 4000,
nodeEnv: process.env.NODE_ENV || 'development',
mongoUri: process.env.MONGO_URI,
allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(','),
globalRateLimitWindowMs: parseInt(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS || '60000'),
globalRateLimitMax: parseInt(process.env.GLOBAL_RATE_LIMIT_MAX || '120'),
contactRateLimitWindowMs: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || '3600000'),
contactRateLimitMax: parseInt(process.env.CONTACT_RATE_LIMIT_MAX || '5'),
seatingLimitPerSlot: parseInt(process.env.SEATING_LIMIT_PER_SLOT || '20'),
jwtSecret: process.env.JWT_SECRET || 'replace-me',
EMAIL_HOST: process.env.EMAIL_HOST,
EMAIL_PORT: process.env.EMAIL_PORT,
EMAIL_SECURE: process.env.EMAIL_SECURE,
EMAIL_USER: process.env.EMAIL_USER,
EMAIL_PASS: process.env.EMAIL_PASS,
EMAIL_FROM: process.env.EMAIL_FROM,
ADMIN_EMAIL: process.env.ADMIN_EMAIL
};