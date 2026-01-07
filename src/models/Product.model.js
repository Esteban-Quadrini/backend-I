
const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true, default: 0 },
  status: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  category: { type: String, default: 'general' },
  thumbnails: { type: [String], default: [] }
}, { timestamps: true });

module.exports = model('Product', productSchema);