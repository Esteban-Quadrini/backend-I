
require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
  try {
    console.log('MONGO_URI=', process.env.MONGO_URI); // línea de debug
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

test();