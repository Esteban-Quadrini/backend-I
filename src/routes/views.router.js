// src/routes/views.router.js
const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const CartManager = require('../managers/CartManager');
const pm = new ProductManager();
const cm = new CartManager();

// Página de inicio: dashboard visual
router.get('/', (req, res) => {
  res.render('home', { title: 'Panel de control' });
});

// Listado de productos con filtros
router.get('/products', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const sort = req.query.sort;
    const q = req.query.q;

    const filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { category: regex }, { code: regex }];
    }

    let sortObj = null;
    if (sort === 'asc') sortObj = { price: 1 };
    else if (sort === 'desc') sortObj = { price: -1 };

    const result = await pm.getAll(filter, { limit, page, sort: sortObj });

    const pagination = {
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.page > 1,
      hasNextPage: result.page < result.totalPages,
      prevLink: result.page > 1 ? `/products?page=${result.page - 1}` : null,
      nextLink: result.page < result.totalPages ? `/products?page=${result.page + 1}` : null
    };

    res.render('products', { products: result.docs, pagination });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await pm.getById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetail', { product });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Vista de carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cm.getById(req.params.cid, true);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;