
const Cart = require('../models/Cart.model');
const { Types } = require('mongoose');

class CartManager {
  async createCart() {
    const cart = await Cart.create({ products: [] });
    return cart.toObject();
  }

  async getById(cid, populate = false) {
    if (populate) return Cart.findById(cid).populate('products.product').lean();
    return Cart.findById(cid).lean();
  }

  async addProductToCart(cartId, productId, qty = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    const pid = Types.ObjectId(productId);
    const existing = cart.products.find(p => p.product.equals(pid));
    if (existing) existing.quantity += qty;
    else cart.products.push({ product: pid, quantity: qty });
    await cart.save();
    return cart.toObject();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    const pid = Types.ObjectId(productId);
    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();
    return cart.toObject();
  }

  async updateCartProducts(cartId, productsArray) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = productsArray.map(p => ({
      product: Types.ObjectId(p.product),
      quantity: p.quantity || 1
    }));
    await cart.save();
    return cart.toObject();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    const pid = Types.ObjectId(productId);
    const existing = cart.products.find(p => p.product.equals(pid));
    if (!existing) return null;
    existing.quantity = quantity;
    await cart.save();
    return cart.toObject();
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    return cart.toObject();
  }
}

module.exports = CartManager;