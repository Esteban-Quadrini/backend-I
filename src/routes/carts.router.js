
const express = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const cm = new CartManager();
const pm = new ProductManager();

router.post('/', async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cm.getById(req.params.cid, true);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = await pm.getById(pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    const updated = await cm.addProductToCart(cid, pid, 1);
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updated = await cm.removeProductFromCart(cid, pid);
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const productsArray = req.body.products || [];
    const updated = await cm.updateCartProducts(req.params.cid, productsArray);
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ status: 'error', error: 'quantity required' });
    const updated = await cm.updateProductQuantity(req.params.cid, req.params.pid, Number(quantity));
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito o producto no encontrado' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const updated = await cm.clearCart(req.params.cid);
    if (!updated) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;