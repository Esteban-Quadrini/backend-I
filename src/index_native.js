
const http = require('http');
const { URL } = require('url');
const ProductManager = require('./managers/ProductManager');
const CartManager = require('./managers/CartManager');

const pm = new ProductManager('src/data/products.json');
const cm = new CartManager('src/data/carts.json');
const PORT = process.env.PORT || 8080;

async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if (!body) return resolve(null);
      try { resolve(JSON.parse(body)); } catch (err) { reject(err); }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res, status, payload) {
  const data = JSON.stringify(payload);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('API backend-I funcionando (native http)');
    }

    // PRODUCTS
    if (pathname === '/api/products' && method === 'GET') {
      const limit = parsedUrl.searchParams.get('limit');
      const products = await pm.getAll();
      return sendJson(res, 200, limit ? products.slice(0, Number(limit)) : products);
    }

    if (pathname === '/api/products' && method === 'POST') {
      const body = await parseJsonBody(req);
      try {
        const created = await pm.add(body || {});
        return sendJson(res, 201, created);
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    }

    if (pathname.startsWith('/api/products/') ) {
      const pid = pathname.split('/')[3];
      if (method === 'GET') {
        const product = await pm.getById(pid);
        if (!product) return sendJson(res, 404, { error: 'Producto no encontrado' });
        return sendJson(res, 200, product);
      }
      if (method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = await pm.update(pid, body || {});
        if (!updated) return sendJson(res, 404, { error: 'Producto no encontrado' });
        return sendJson(res, 200, updated);
      }
      if (method === 'DELETE') {
        const removed = await pm.delete(pid);
        if (!removed) return sendJson(res, 404, { error: 'Producto no encontrado' });
        return sendJson(res, 200, { success: true });
      }
    }

    // CARTS
    if (pathname === '/api/carts' && method === 'POST') {
      const cart = await cm.createCart();
      return sendJson(res, 201, cart);
    }

    if (pathname.startsWith('/api/carts/') && method === 'GET') {
      const cid = pathname.split('/')[3];
      const cart = await cm.getById(cid);
      if (!cart) return sendJson(res, 404, { error: 'Carrito no encontrado' });
      return sendJson(res, 200, cart);
    }

    if (pathname.startsWith('/api/carts/') && pathname.includes('/product/') && method === 'POST') {
      const parts = pathname.split('/');
      const cid = parts[3];
      const pid = parts[5];
      const product = await pm.getById(pid);
      if (!product) return sendJson(res, 404, { error: 'Producto no encontrado' });
      const updated = await cm.addProductToCart(cid, pid);
      if (!updated) return sendJson(res, 404, { error: 'Carrito no encontrado' });
      return sendJson(res, 200, updated);
    }

    sendJson(res, 404, { error: 'Ruta no encontrada' });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: 'Error interno del servidor' });
  }
});

server.listen(PORT, () => {
  console.log(`Native HTTP server listening on port ${PORT}`);
});