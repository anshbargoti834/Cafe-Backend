// src/middlewares/upload.js
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // Import the file we made in Step 3

const upload = multer({ storage: storage });

module.exports = upload;
