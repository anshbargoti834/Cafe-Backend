const express = require('express');
const router = express.Router();
const controller = require('../controllers/contact.controller');
const { validateBody } = require('../middleware/validation.middleware');
const Joi = require('joi');
const { contactRateLimiter } = require('../middleware/rateLimit.middleware');

const { protectAdmin } = require('../middleware/auth.middleware');


const contactSchema = Joi.object({
name: Joi.string().min(1).max(100).required(),
email: Joi.string().email().required(),
message: Joi.string().min(5).max(2000).required()
});


router.post('/', contactRateLimiter, validateBody(contactSchema), controller.createContact);

// 1. Get All Messages
router.get('/', protectAdmin, controller.getAllContacts);

// 2. Delete Message (Add this to your controller too if missing!)
router.delete('/:id', protectAdmin, controller.deleteContact);

router.post('/:id/reply', protectAdmin, controller.replyContact);


module.exports = router;