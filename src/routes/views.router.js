
const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const pm = new ProductManager('src/data/products.json');


router.get('/', async (req, res) => {
  const products = await pm.getAll();
  res.render('home', { products, title: 'Home - Productos' });
});


router.get('/realtimeproducts', async (req, res) => {
  const products = await pm.getAll();
  res.render('realTimeProducts', { products, title: 'Productos en tiempo real' });
});

module.exports = router;