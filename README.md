## Endpoints principales

### Productos
- `GET /api/products` — listar todos los productos.
- `GET /api/products/:pid` — obtener producto por id.
- `POST /api/products` — crear producto. Body JSON:
  ```json
  {
    "title":"Nombre",
    "description":"Descripción",
    "code":"COD01",
    "price": 10.5,
    "status": true,
    "stock": 5,
    "category":"categoria",
    "thumbnails":["/images/1.jpg"]
  }
