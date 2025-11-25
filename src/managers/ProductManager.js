const fs = require('fs').promises;
const path = require('path');

class ProductManager {
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

  async getAll() {
    return await this._read();
  }

  async getById(id) {
    const items = await this._read();
    return items.find(p => p.id === String(id));
  }

  async add(product) {
    if (!product.title || product.price === undefined) throw new Error('title and price required');
    const items = await this._read();
    const id = Date.now().toString();
    const newProduct = { id, status: true, thumbnails: [], ...product };
    items.push(newProduct);
    await this._write(items);
    return newProduct;
  }

  async update(id, changes) {
    const items = await this._read();
    const idx = items.findIndex(p => p.id === String(id));
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...changes, id: items[idx].id };
    await this._write(items);
    return items[idx];
  }

  async delete(id) {
    const items = await this._read();
    const idx = items.findIndex(p => p.id === String(id));
    if (idx === -1) return false;
    items.splice(idx, 1);
    await this._write(items);
    return true;
  }
}

module.exports = ProductManager;
