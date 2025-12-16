#  BACKEND-I · API REST con Express, Handlebars y WebSockets

Proyecto desarrollado como parte del curso de Backend. Implementa una API RESTful con Express, persistencia en archivos JSON, autenticación con bcrypt, vistas dinámicas con Handlebars y actualización en tiempo real con WebSockets.

---

##  Tecnologías utilizadas

- Node.js + Express
- Handlebars (motor de plantillas)
- Socket.io (WebSockets)
- bcrypt (hash de contraseñas)
- Persistencia en archivos `.json`


---

##  Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/backend-I.git
cd backend-I

---
npm install

---
npm run dev       # Inicia el servidor con nodemon (modo desarrollo)
npm start         # Inicia el servidor en modo producción
---
 Autenticación
- Registro: POST /api/auth/register
- Login: POST /api/auth/login
- Las contraseñas se almacenan hasheadas con bcrypt.
- Los usuarios se guardan en src/data/users.json.

----
 API REST
Productos
- GET /api/products → Lista todos los productos
- POST /api/products → Agrega un producto
- DELETE /api/products/:pid → Elimina un producto
Carritos
- GET /api/carts → Lista todos los carritos
- POST /api/carts → Crea un carrito
- POST /api/carts/:cid/product/:pid → Agrega producto al carrito


---

Vistas Handlebars
GET /
Renderiza la vista home.handlebars con la lista de productos actuales.
GET /realtimeproducts
Renderiza la vista realTimeProducts.handlebars con:
- Lista de productos en tiempo real
- Formulario para crear productos
- Formulario para eliminar productos
- WebSockets integrados con Socket.io

---

 Estado actual del proyecto
 Entrega 1 completa
 Entrega 2 completa (Handlebars + WebSockets)

----

👨‍💻 Autor
Esteban.Quadrini
Desarrollador web y líder de producto


