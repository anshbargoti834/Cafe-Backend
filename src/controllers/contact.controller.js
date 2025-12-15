// src/controllers/contact.controller.js
const Contact = require('../models/Contact');
const { successResponse, errorResponse } = require('../utils/response');
const { sendMail } = require('../utils/mailer');
const { ADMIN_EMAIL } = require('../config/env');
const logger = require('../utils/logger');

/**
 * POST /api/contact
 * body: { name, email, message }
 */
exports.createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // 1. Save to DB (Fast)
    const contact = await Contact.create({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      ip: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    // ---------------------------------------------------------
    // CHANGE: Send Response FIRST
    // ---------------------------------------------------------
    // The user sees "Message Sent" immediately
    successResponse(res, 201, { contact });

    // ---------------------------------------------------------
    // CHANGE: Send Emails in Background
    // ---------------------------------------------------------
    (async () => {
      try {
        // Prepare emails
        const userSubject = 'Thank you for contacting Us';
        const userHtml = `
          <p>Hi ${contact.name},</p>
          <p>Thanks for reaching out to <strong>Our Cafe</strong>. We received your message and will reply as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <blockquote style="border-left:3px solid #eee;padding-left:10px;color:#444;">${contact.message}</blockquote>
          <p>— Cafe Team</p>
        `;

        const adminSubject = `New contact form message from ${contact.name}`;
        const adminHtml = `
          <p>New contact submission received.</p>
          <p><strong>Name:</strong> ${contact.name}<br/>
          <strong>Email:</strong> ${contact.email}<br/>
          <strong>Message:</strong></p>
          <blockquote style="border-left:3px solid #eee;padding-left:10px;color:#444;">${contact.message}</blockquote>
          <p><strong>Meta:</strong> IP: ${contact.ip || 'n/a'}; User-Agent: ${contact.userAgent || 'n/a'}</p>
          <p>Contact ID: ${contact._id}</p>
        `;

        // send confirmation to user
        await sendMail({ to: contact.email, subject: userSubject, html: userHtml });

        // send notification to admin (if ADMIN_EMAIL configured)
        if (ADMIN_EMAIL) {
          await sendMail({ to: ADMIN_EMAIL, subject: adminSubject, html: adminHtml });
        } else {
          logger.warn('ADMIN_EMAIL not configured; admin notification not sent.');
        }
      } catch (mailErr) {
        // Log the error but do not break the API since response is already sent
        logger.error('Failed to send contact mails: ' + (mailErr && mailErr.message ? mailErr.message : mailErr));
      }
    })();

  } catch (err) {
    next(err);
  }
};

/**
 * (Optional) GET /api/contact - list messages (admin only)
 */
exports.getAllContacts = async (req, res, next) => {
  try {
    const items = await Contact.find({}).sort({ createdAt: -1 });
    return successResponse(res, 200, { items });
  } catch (err) {
    next(err);
  }
};

/**
 * REPLY CONTACT
 */
exports.replyContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body; 

    if (!replyMessage) {
      return errorResponse(res, 400, "Reply message cannot be empty");
    }

    // 1. Find the original message to get customer's email
    const originalContact = await Contact.findById(id);
    if (!originalContact) {
      return errorResponse(res, 404, "Original message not found");
    }

    // ---------------------------------------------------------
    // CHANGE: Send Response FIRST
    // ---------------------------------------------------------
    successResponse(res, 200, { message: "Reply sent successfully" });

    // ---------------------------------------------------------
    // CHANGE: Send Email in Background
    // ---------------------------------------------------------
    (async () => {
        try {
            // 2. Prepare the Email
            const emailSubject = `Re: Your inquiry to Lumiére Café`;
            const emailHtml = `
            <p>Dear ${originalContact.name},</p>
            <p>Thank you for contacting us.</p>
            <p>${replyMessage.replace(/\n/g, '<br/>')}</p> 
            <hr/>
            <p style="font-size: 12px; color: #888;">Lumiére Café Management</p>
            `;

            // 3. Send via your existing mailer utility
            await sendMail({
                to: originalContact.email,
                subject: emailSubject,
                html: emailHtml
            });
        } catch (mailErr) {
            logger.error('Failed to send reply email: ' + (mailErr.message || mailErr));
        }
    })();

  } catch (err) {
    next(err);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return errorResponse(res, 404, "Message not found");
    }

    return successResponse(res, 200, { message: "Message deleted successfully" });
  } catch (err) {
    next(err);
  }
};