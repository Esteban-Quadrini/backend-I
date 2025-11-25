const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const pm = new ProductManager('src/data/products.json');

// Listar productos (opcional query ?limit=)
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await pm.getAll();
    if (limit) return res.json(products.slice(0, Number(limit)));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener producto por id
router.get('/:pid', async (req, res) => {
  try {
    const product = await pm.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear producto (id autogenerado)
router.post('/', async (req, res) => {
  try {
    const created = await pm.add(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar producto (no modificar id)
router.put('/:pid', async (req, res) => {
  try {
    const updated = await pm.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const removed = await pm.delete(req.params.pid);
    if (!removed) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;