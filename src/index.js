
const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const authRouter = require('./routes/auth.router');
const viewsRouter = require('./routes/views.router');

const ProductManager = require('./managers/ProductManager');
const pm = new ProductManager('src/data/products.json');

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/auth', authRouter);
app.use('/', viewsRouter);


const httpServer = app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`👉 Abrí en tu navegador: http://localhost:${PORT}/`);
  console.log(`👉 Vista realtime: http://localhost:${PORT}/realtimeproducts`);
});

const io = new Server(httpServer);


io.on('connection', async socket => {
  console.log('Cliente conectado');

  
  const products = await pm.getAll();
  socket.emit('products', products);

  
  socket.on('newProduct', async data => {
    await pm.add(data);
    const updated = await pm.getAll();
    io.emit('products', updated);
  });

  
  socket.on('deleteProduct', async pid => {
    await pm.delete(pid);
    const updated = await pm.getAll();
    io.emit('products', updated);
  });
});