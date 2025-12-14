const mongoose = require('mongoose');


const ReservationSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
phone: { type: String, required: true, trim: true },
email: { type: String, required: false, trim: true },
numberOfGuests: { type: Number, required: true, min: 1 },
date: { type: String, required: true }, // ISO date string (YYYY-MM-DD)
timeSlot: { type: String, required: true }, // e.g. "18:00-19:00"
specialNote: { type: String, default: '' },
status: { type: String, enum: ['confirmed','cancelled'], default: 'confirmed' }
}, { timestamps: true });


ReservationSchema.index({ date: 1, timeSlot: 1 });


module.exports = mongoose.model('Reservation', ReservationSchema);