const express = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const cm = new CartManager('src/data/carts.json');
const pm = new ProductManager('src/data/products.json');

router.post('/', async (req, res) => {
  const cart = await cm.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cm.getById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const product = await pm.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  const updated = await cm.addProductToCart(cid, pid);
  if (!updated) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(updated);
});

module.exports = router;
