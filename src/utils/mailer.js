const nodemailer = require('nodemailer');
const logger = require('./logger');
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM
} = require('../config/env');

// Gmail SMTP over port 587 (STARTTLS)
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 587,
  secure: false,  // false for 587, true for 465
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});


// Log if mailer is ready
transporter.verify()
  .then(() => logger.info("Mailer connected OK (Gmail 587 STARTTLS)"))
  .catch(err => logger.error("Mailer verification failed: " + err.message));

// Reusable sendMail function
async function sendMail(options) {
  const mailOptions = { from: EMAIL_FROM, ...options };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
