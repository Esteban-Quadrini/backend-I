
require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const { connect, mongoose } = require('./db/mongoose');
const Product = require('./models/Product.model');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const authRouter = require('./routes/auth.router');
const viewsRouter = require('./routes/views.router');

const broadcaster = require('./utils/broadcast');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/auth', authRouter);
app.use('/', viewsRouter);


app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    mongoReadyState: state
  });
});

async function ensureSeedIfEmpty() {
  try {
    const count = await Product.countDocuments();
    console.log(`• Products in DB: ${count}`);
    if (count === 0) {
      console.log('⚠️ No products found. Seeding sample products...');
      const items = [
        { title: 'Camiseta Azul', code: 'CAM-AZ-001', price: 1999, description: 'Camiseta algodón 100%', category: 'ropa', stock: 20 },
        { title: 'Gorra Negra', code: 'GOR-NE-001', price: 1299, description: 'Gorra con logo', category: 'accesorios', stock: 15 },
        { title: 'Zapatillas Urban', code: 'ZAP-001', price: 7999, description: 'Zapatillas cómodas', category: 'calzado', stock: 10 }
      ];
      try {
        const created = await Product.insertMany(items, { ordered: false });
        console.log('✅ Seed completed. Created product IDs:', created.map(p => p._id).join(', '));
      } catch (err) {
        console.error('⚠️ Seed error (possible duplicates):', err.message);
      }
    } else {
      console.log('✅ Products already present. No seed needed.');
    }
  } catch (err) {
    console.error('❌ Error checking products collection:', err.message);
  }
}

async function start() {
  console.log('----------------------------------------');
  console.log('🔎 Startup checks:');
  console.log(`• NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`• PORT: ${PORT}`);
  console.log(`• MONGO_URI present: ${process.env.MONGO_URI ? 'yes' : 'NO'}`);

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined. Create a .env file with MONGO_URI and restart.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await connect(process.env.MONGO_URI);
    console.log('🔁 Checking DB connection state:', mongoose.connection.readyState);
  } catch (err) {
    console.error('❌ Could not connect to MongoDB. See error above.');
    process.exit(1);
  }

  
  await ensureSeedIfEmpty();

  const httpServer = app.listen(PORT, () => {
    console.log('✅ Server listening on port', PORT);
    console.log('👉 Open in browser: http://localhost:' + PORT + '/products');
    console.log('• Health: http://localhost:' + PORT + '/health');
    console.log('• API products: GET http://localhost:' + PORT + '/api/products');
    console.log('----------------------------------------');
  });

  const io = new Server(httpServer);
  broadcaster.setIO(io);

  io.on('connection', socket => {
    console.log('🔌 Client connected via WebSocket', socket.id);
  });
}

start().catch(err => {
  console.error('Startup error', err);
  process.exit(1);
});