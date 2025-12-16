
const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveAll(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async add(product) {
    const products = await this.getAll();

    // Generar ID único
    const newId = products.length > 0 
      ? (parseInt(products[products.length - 1].id) + 1).toString()
      : "1001";

    const newProduct = {
      id: newId,
      ...product
    };

    products.push(newProduct);
    await this.saveAll(products);
    return newProduct;
  }

  async delete(pid) {
    let products = await this.getAll();
    products = products.filter(p => p.id !== pid);
    await this.saveAll(products);
  }
}

module.exports = ProductManager;