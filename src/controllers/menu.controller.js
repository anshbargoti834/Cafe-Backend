const Menu = require('../models/Menu');
const { successResponse, errorResponse } = require('../utils/response');
const fs = require('fs');
const path = require('path');

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
    // 1. Check for File Upload first
    // 2. If no file, check if a URL string was sent in req.body.image
    // 3. If neither, it remains null
    let finalImage = null;

    if (req.file) {
      finalImage = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      finalImage = req.body.image;
    }

    const { name, description, price, category, isAvailable } = req.body;

    const doc = await Menu.create({
      name, 
      description, 
      price, 
      category, 
      image: finalImage, // Use the result of our logic above
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
    
    // req.body contains the text fields AND the image path (thanks to normalizeImage middleware)
    // We use { new: true } to return the updated document
    const updatedItem = await Menu.findByIdAndUpdate(
      id, 
      req.body, 
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

    // 1. Find the item first (so we know the image path)
    const item = await Menu.findById(id);

    if (!item) {
      return errorResponse(res, 404, "Menu item not found");
    }

    // 2. "Garbage Collection": Delete the image file from the server folder
    if (item.image && !item.image.startsWith('http')) {
      // Logic: Convert "/uploads/abc.jpg" -> "C:\Users\You\Project\uploads\abc.jpg"
      const imagePath = path.join(__dirname, '..', '..', item.image);
      
      // Delete the file
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete local image:", err);
        else console.log("Deleted local image:", imagePath);
      });
    }

    // 3. Now delete the database record
    await Menu.findByIdAndDelete(id);

    return successResponse(res, 200, { message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};