const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservation.controller');
const { validateBody, validateQuery } = require('../middleware/validation.middleware');
const Joi = require('joi');
const { protectAdmin } = require('../middleware/auth.middleware');


const reservationSchema = Joi.object({
name: Joi.string().min(1).max(100).required(),
phone: Joi.string().length(10).pattern(/^[0-9]{10}$/).required(),
email: Joi.string().email().optional().allow('', null),
numberOfGuests: Joi.number().integer().min(1).max(20).required(),
date: Joi.string().pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
timeSlot: Joi.string().min(3).max(30).required(),
specialNote: Joi.string().allow('', null).max(500)
});


const availabilityQuerySchema = Joi.object({
date: Joi.string().pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
timeSlot: Joi.string().min(3).max(30).required()
});


router.post('/', validateBody(reservationSchema), controller.createReservation);
router.get('/availability', validateQuery(availabilityQuerySchema), controller.checkAvailability);
// --- PROTECTED ADMIN ROUTES ---

// 1. Get List
router.get('/', protectAdmin, controller.getAllReservations);

// 2. Delete/Cancel
router.delete('/:id', protectAdmin, controller.deleteReservation);


module.exports = router;