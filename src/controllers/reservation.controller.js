// src/controllers/reservation.controller.js
const Reservation = require('../models/Reservation');
const { seatingLimitPerSlot } = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');
const { sendMail } = require('../utils/mailer');
const { ADMIN_EMAIL } = require('../config/env');
const logger = require('../utils/logger');

// NEW: Admin - Get All Reservations
exports.getAllReservations = async (req, res, next) => {
  try {
    // Sort by Date (Newest first)
    const reservations = await Reservation.find().sort({ date: -1, timeSlot: 1 });
    return successResponse(res, 200, { reservations });
  } catch (err) {
    next(err);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);
    
    if (!deleted) {
      return errorResponse(res, 404, "Reservation not found");
    }
    
    return successResponse(res, 200, { message: "Reservation cancelled" });
  } catch (err) {
    next(err);
  }
};


// Helper to count seats booked for a date+slot
async function countSeats(date, timeSlot) {
  const agg = await Reservation.aggregate([
    { $match: { date, timeSlot, status: 'confirmed' } },
    { $group: { _id: null, total: { $sum: '$numberOfGuests' } } }
  ]);
  return (agg[0] && agg[0].total) || 0;
}

exports.createReservation = async (req, res, next) => {
  try {
    const { name, phone, email, numberOfGuests, date, timeSlot, specialNote } = req.body;

    // compute seats already taken
    const taken = await countSeats(date, timeSlot);
    if (taken + numberOfGuests > seatingLimitPerSlot) {
      return errorResponse(res, 400, 'Selected time slot is fully booked or does not have enough seats.');
    }

    const reservation = await Reservation.create({ name, phone, email, numberOfGuests, date, timeSlot, specialNote });

    // Send emails (do not block response too long — but await so errors can be logged)
    try {
      // User confirmation email (if provided)
      if (email) {
        const userSubject = `Reservation confirmed — ${date} ${timeSlot}`;
        const userHtml = `
          <p>Hi ${name},</p>
          <p>Thank you for reserving a table at <strong>Our Cafe</strong>.</p>
          <p><strong>Reservation details</strong><br/>
          Date: ${date}<br/>
          Time: ${timeSlot}<br/>
          Guests: ${numberOfGuests}<br/>
          ${specialNote ? `Note: ${specialNote}<br/>` : ''}
          </p>
          <p>We look forward to serving you!</p>
          <p>— Cafe Team</p>
        `;
        await sendMail({ to: email, subject: userSubject, html: userHtml });
      }

      // Admin notification
      if (ADMIN_EMAIL) {
        const adminSubject = `New reservation: ${name} — ${date} ${timeSlot}`;
        const adminHtml = `
          <p>New reservation received</p>
          <p><strong>Customer:</strong> ${name} (${phone})${email ? ` — ${email}` : ''}</p>
          <p><strong>Details</strong><br/>
          Date: ${date}<br/>
          Time: ${timeSlot}<br/>
          Guests: ${numberOfGuests}<br/>
          ${specialNote ? `Note: ${specialNote}<br/>` : ''}
          </p>
          <p>Reservation ID: ${reservation._id}</p>
        `;
        await sendMail({ to: ADMIN_EMAIL, subject: adminSubject, html: adminHtml });
      }
    } catch (mailErr) {
      // Log mail errors but still return success to client
      logger.error('Failed to send reservation emails: ' + (mailErr && mailErr.message ? mailErr.message : mailErr));
    }

    return successResponse(res, 201, { reservation });
  } catch (err) {
    next(err);
  }
};

exports.checkAvailability = async (req, res, next) => {
  try {
    const { date, timeSlot } = req.query;
    if (!date || !timeSlot) return errorResponse(res, 400, 'date and timeSlot query parameters are required');

    const taken = await countSeats(date, timeSlot);
    const remaining = Math.max(0, seatingLimitPerSlot - taken);
    return successResponse(res, 200, { date, timeSlot, remainingSeats: remaining, seatingLimitPerSlot });
  } catch (err) {
    next(err);
  }
};
