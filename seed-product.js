
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product.model');

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('Define MONGO_URI en .env antes de ejecutar seed-product.js');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const items = [
    { title: 'Camiseta Azul', code: 'CAM-AZ-001', price: 1999, description: 'Camiseta algodón 100%', category: 'ropa', stock: 20 },
    { title: 'Gorra Negra', code: 'GOR-NE-001', price: 1299, description: 'Gorra con logo', category: 'accesorios', stock: 15 },
    { title: 'Zapatillas Urban', code: 'ZAP-001', price: 7999, description: 'Zapatillas cómodas', category: 'calzado', stock: 10 }
  ];

  try {
    const created = await Product.insertMany(items, { ordered: false });
    console.log('✅ Productos creados:', created.map(p => p._id));
  } catch (err) {
    console.error('⚠️ Error al insertar (puede ser duplicado):', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();