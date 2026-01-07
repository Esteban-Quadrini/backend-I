
const { Schema, model, Types } = require('mongoose');

const cartProductSchema = new Schema({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

const cartSchema = new Schema({
  products: { type: [cartProductSchema], default: [] }
}, { timestamps: true });

module.exports = model('Cart', cartSchema);