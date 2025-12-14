const express = require('express');
const router = express.Router();
const controller = require('../controllers/menu.controller');
const { validateBody } = require('../middleware/validation.middleware');
const Joi = require('joi');
const upload = require('../middleware/upload.middleware');

// 1. IMPORT SECURITY MIDDLEWARE
const { protectAdmin } = require('../middleware/auth.middleware');

const menuSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('', null).max(2000),
  price: Joi.number().precision(2).min(0).required(),
  category: Joi.string().min(1).max(100).required(),
  image: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().pattern(/^\/uploads\/.+$/),
    Joi.string().allow('', null)
  ),
  isAvailable: Joi.boolean().optional()
});

const normalizeImage = (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  next();
};

// --- PUBLIC ROUTES (Everyone can see menu) ---
router.get('/', controller.getAllMenu);
router.get('/category/:category', controller.getMenuByCategory);

// --- PROTECTED ROUTES (Only Admin) ---

// Create
router.post(
  '/',
  protectAdmin,             // <--- SECURITY LOCK
  upload.single('image'),
  normalizeImage,
  validateBody(menuSchema),
  controller.createMenuItem
);

// Update
router.put(
  '/:id',
  protectAdmin,             // <--- SECURITY LOCK
  upload.single('image'),
  normalizeImage,
  validateBody(menuSchema), 
  controller.updateMenuItem
);

// Delete
router.delete('/:id', protectAdmin, controller.deleteMenuItem); // <--- SECURITY LOCK

module.exports = router;