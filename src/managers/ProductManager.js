
const Product = require('../models/Product.model');

class ProductManager {
  async add(product) {
    const doc = await Product.create(product);
    return doc.toObject();
  }

  async getAll(filter = {}, options = {}) {
    const limit = options.limit || 10;
    const page = options.page || 1;
    const sort = options.sort || null;

    const query = Product.find(filter);
    if (sort) query.sort(sort);
    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    const docs = await query.lean().exec();
    return { docs, total, totalPages, page, limit };
  }

  async getById(id) {
    return Product.findById(id).lean();
  }

  async update(id, changes) {
    const updated = await Product.findByIdAndUpdate(id, changes, { new: true, runValidators: true }).lean();
    return updated;
  }

  async delete(id) {
    const res = await Product.findByIdAndDelete(id);
    return !!res;
  }
}

module.exports = ProductManager;