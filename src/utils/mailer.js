const nodemailer = require('nodemailer');
const logger = require('./logger');
// 1. We import the clean variables here
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM
} = require('../config/env');

// Gmail SMTP (Fixed for 465 SSL)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,              // Using 465
  secure: true,           // TRUE for 465
  auth: {
    user: EMAIL_USER,     // <--- FIX: Use the imported variable
    pass: EMAIL_PASS      // <--- FIX: Use the imported variable
  },
  tls: {
    rejectUnauthorized: false 
  },
  family: 4 
});

// Log if mailer is ready
transporter.verify()
  .then(() => logger.info("Mailer connected OK (Gmail 465 SSL)")) // Updated log text
  .catch(err => {
    logger.error("Mailer verification failed: " + err.message);
    // Print what we tried to use (for debugging only, remove later)
    console.log("Debug - User:", EMAIL_USER ? "Present" : "Missing");
    console.log("Debug - Pass:", EMAIL_PASS ? "Present" : "Missing");
  });

async function sendMail(options) {
  const mailOptions = { from: EMAIL_FROM, ...options };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };