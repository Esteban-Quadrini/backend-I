
const mongoose = require('mongoose');

function attachListeners() {
  mongoose.connection.on('connected', () => console.log('🟢 Mongoose event: connected'));
  mongoose.connection.on('error', (err) => console.error('🔴 Mongoose event: error', err));
  mongoose.connection.on('disconnected', () => console.log('🟠 Mongoose event: disconnected'));
}

async function connect(uri) {
  attachListeners();
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error', err.message);
    throw err;
  }
}

module.exports = { connect, mongoose };