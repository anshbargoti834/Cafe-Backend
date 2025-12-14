const mongoose = require('mongoose');


const MenuSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
description: { type: String, default: '' },
price: { type: Number, required: true },
category: { type: String, required: true, index: true },
image: { type: String, default: '' },
isAvailable: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Menu', MenuSchema);