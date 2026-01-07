
const express = require('express');
const ProductManager = require('../managers/ProductManager');
const broadcaster = require('../utils/broadcast');
const router = express.Router();
const pm = new ProductManager();


router.get('/', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const sortParam = req.query.sort;
    const q = req.query.q; 

    const filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { category: regex }, { code: regex }];
    }

    let sort = null;
    if (sortParam === 'asc') sort = { price: 1 };
    else if (sortParam === 'desc') sort = { price: -1 };

    const result = await pm.getAll(filter, { limit, page, sort });

    const totalPages = result.totalPages;
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const product = await pm.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { title, code, price } = req.body;
    if (!title || !code || price === undefined) {
      return res.status(400).json({ status: 'error', error: 'title, code y price son obligatorios' });
    }
    const created = await pm.add(req.body);
    const all = await pm.getAll({}, { limit: 10, page: 1 });
    broadcaster.emitProducts(all.docs);
    res.status(201).json({ status: 'success', payload: created });
  } catch (err) {
    
    if (err.code === 11000) return res.status(409).json({ status: 'error', error: 'El code ya existe' });
    res.status(400).json({ status: 'error', error: err.message });
  }
});


router.put('/:pid', async (req, res) => {
  try {
    const updated = await pm.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    const all = await pm.getAll({}, { limit: 10, page: 1 });
    broadcaster.emitProducts(all.docs);
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});


router.delete('/:pid', async (req, res) => {
  try {
    const removed = await pm.delete(req.params.pid);
    if (!removed) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    const all = await pm.getAll({}, { limit: 10, page: 1 });
    broadcaster.emitProducts(all.docs);
    res.json({ status: 'success', payload: { removed: true } });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;