const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filePath) {
    this.path = path.resolve(filePath);
  }

  async _read() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  async _write(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._read();
    const id = Date.now().toString();
    const newCart = { id, products: [] };
    carts.push(newCart);
    await this._write(carts);
    return newCart;
  }

  async getById(id) {
    const carts = await this._read();
    return carts.find(c => c.id === String(id));
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._read();
    const cart = carts.find(c => c.id === String(cartId));
    if (!cart) return null;
    const prod = cart.products.find(p => p.product === String(productId));
    if (prod) {
      prod.quantity += 1;
    } else {
      cart.products.push({ product: String(productId), quantity: 1 });
    }
    await this._write(carts);
    return cart;
  }
}

module.exports = CartManager;
