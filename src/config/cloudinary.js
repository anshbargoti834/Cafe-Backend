// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// 2. Configure Storage Settings
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cafe-menu-images', // The folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

module.exports = { cloudinary, storage };