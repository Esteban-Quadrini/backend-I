const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const pm = new ProductManager('src/data/products.json');

router.get('/', async (req, res) => {
  const { limit } = req.query;
  const products = await pm.getAll();
  if (limit) return res.json(products.slice(0, Number(limit)));
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await pm.getById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  try {
    const created = await pm.add(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  const updated = await pm.update(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  const removed = await pm.delete(req.params.pid);
  if (!removed) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ success: true });
});

module.exports = router;
