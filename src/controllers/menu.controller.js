const Menu = require('../models/Menu');
const { successResponse, errorResponse } = require('../utils/response');
// REMOVED: const fs = require('fs');
// REMOVED: const path = require('path');

exports.getAllMenu = async (req, res, next) => {
  try {
    const items = await Menu.find({}).sort({ category: 1, name: 1 });
    return successResponse(res, 200, { items });
  } catch (err) {
    next(err);
  }
};

exports.getMenuByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const items = await Menu.find({ category }).sort({ name: 1 });
    return successResponse(res, 200, { items });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    let finalImage = null;

    // CHANGE: Cloudinary puts the Full URL in 'req.file.path'
    if (req.file) {
      finalImage = req.file.path; 
    } else if (req.body.image) {
      finalImage = req.body.image; // Fallback for manual URL string
    }

    const { name, description, price, category, isAvailable } = req.body;

    const doc = await Menu.create({
      name, 
      description, 
      price, 
      category, 
      image: finalImage, 
      isAvailable: !!isAvailable
    });

    return successResponse(res, 201, { item: doc });
  } catch (err) {
    next(err);
  }
};

// PUT /api/menu/:id -> Update
exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // CHANGE: Handle image update logic manually to be safe
    let updateData = { ...req.body };

    // If a new file is uploaded, update the image field with the new Cloudinary URL
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedItem = await Menu.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return errorResponse(res, 404, "Menu item not found");
    }

    return successResponse(res, 200, { item: updatedItem });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/menu/:id -> Delete
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Menu.findById(id);

    if (!item) {
      return errorResponse(res, 404, "Menu item not found");
    }

    // REMOVED: The "fs.unlink" block.
    // Since images are now on Cloudinary, we don't delete them from the local disk.
    // (Optional: You could add Cloudinary delete logic here later, but for the demo, simply removing the database record is enough.)

    // Delete the database record
    await Menu.findByIdAndDelete(id);

    return successResponse(res, 200, { message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};