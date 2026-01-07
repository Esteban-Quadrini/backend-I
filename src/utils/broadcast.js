
let ioInstance = null;
function setIO(io) { ioInstance = io; }
function emitProducts(products) { if (!ioInstance) return; ioInstance.emit('products', products); }
module.exports = { setIO, emitProducts };