# 🛒 Ecommerce API - Backend con MongoDB

Una API completa de ecommerce desarrollada con Node.js, Express, MongoDB y Handlebars. Implementa gestión de productos y carritos de compras con paginación, filtros avanzados, vistas web responsivas y persistencia de datos.

## 🚀 Características Principales

### ✅ **Gestión de Productos**
- 📦 CRUD completo de productos
- 🔍 Paginación con límite personalizable
- 🏷️ Filtros por categoría y disponibilidad
- 📊 Ordenamiento por precio (ascendente/descendente)
- 🖼️ Soporte para múltiples imágenes
- ✅ Validaciones robustas de datos

### ✅ **Gestión de Carritos**
- 🛒 Creación y gestión de carritos
- ➕ Agregar productos al carrito
- 🔢 Actualización de cantidades
- 🗑️ Eliminación de productos específicos
- 🧹 Vaciar carrito completo
- 📊 Cálculo automático de totales

### ✅ **Interfaz Web**
- 🎨 Vistas responsivas con Handlebars
- 📱 Diseño moderno y mobile-first
- 🔍 Filtros interactivos
- 📄 Navegación con paginación
- 🖼️ Vista de detalle de productos
- 🛒 Carrito visual con gestión completa

### ✅ **API RESTful**
- 🌐 Endpoints REST completos
- 📋 Respuestas JSON estructuradas
- 🔒 Validaciones de datos
- ⚡ Manejo de errores robusto
- 📊 Formato de respuesta consistente

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Templates**: Handlebars
- **Paginación**: mongoose-paginate-v2
- **Estilos**: CSS3 (Grid, Flexbox)
- **Frontend**: JavaScript Vanilla

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## 🚀 Instalación y Configuración

### 1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd ecommerce_entrega_final
```

### 2. **Instalar dependencias**
```bash
npm install
```

### 3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
MONGO_URI=mongodb://localhost:27017/ecommerce
PORT=8080
```

### 4. **Cargar datos de ejemplo (opcional)**
```bash
npm run seed
```

### 5. **Ejecutar el proyecto**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🌐 Endpoints de la API

### **Productos**

#### **Obtener productos con paginación y filtros**
```http
GET /products/api?limit=10&page=1&sort=asc&query=electronics
```

**Parámetros de consulta:**
- `limit` (opcional): Número de productos por página (default: 10)
- `page` (opcional): Número de página (default: 1)
- `sort` (opcional): Ordenamiento por precio (`asc`/`desc`)
- `query` (opcional): Filtro por categoría o `available`

**Respuesta:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "?page=1&limit=10&sort=asc&query=electronics",
  "nextLink": "?page=3&limit=10&sort=asc&query=electronics"
}
```

#### **Obtener producto por ID**
```http
GET /products/api/:pid
```

#### **Crear producto**
```http
POST /products/api
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "description": "El último iPhone con tecnología avanzada",
  "code": "IPH15PRO-256",
  "price": 999.99,
  "stock": 50,
  "category": "electronics",
  "status": true,
  "thumbnails": [
    "https://ejemplo.com/imagen1.jpg",
    "https://ejemplo.com/imagen2.jpg"
  ]
}
```

### **Carritos**

#### **Crear carrito**
```http
POST /api/carts
```

#### **Obtener carrito**
```http
GET /api/carts/:cid
```

#### **Agregar producto al carrito**
```http
POST /api/carts/:cid/products/:pid
Content-Type: application/json

{
  "quantity": 2
}
```

#### **Actualizar cantidad de producto**
```http
PUT /api/carts/:cid/products/:pid
Content-Type: application/json

{
  "quantity": 5
}
```

#### **Eliminar producto del carrito**
```http
DELETE /api/carts/:cid/products/:pid
```

#### **Actualizar carrito completo**
```http
PUT /api/carts/:cid
Content-Type: application/json

{
  "products": [
    {
      "product": "productId1",
      "quantity": 2
    },
    {
      "product": "productId2", 
      "quantity": 1
    }
  ]
}
```

#### **Vaciar carrito**
```http
DELETE /api/carts/:cid
```

## 🎨 Vistas Web

### **Rutas de Vistas**
- `/products` - Lista de productos con paginación y filtros
- `/products/:pid` - Detalle de producto individual
- `/products/view/add` - Formulario para crear producto
- `/carts/:cid` - Vista del carrito específico

### **Características de las Vistas**
- 📱 **Responsive Design**: Adaptable a móviles y tablets
- 🔍 **Filtros Interactivos**: Por categoría, disponibilidad y ordenamiento
- 📄 **Paginación Visual**: Navegación intuitiva entre páginas
- 🛒 **Carrito Visual**: Gestión completa con totales automáticos
- ➕ **Formulario de Productos**: Creación con validaciones en tiempo real

## 🏷️ Categorías de Productos

- `electronics` - Electrónicos
- `clothing` - Ropa
- `books` - Libros
- `home` - Hogar
- `sports` - Deportes
- `beauty` - Belleza
- `toys` - Juguetes
- `automotive` - Automotriz
- `other` - Otros

## 📊 Estructura del Proyecto

```
src/
├── controllers/
│   ├── productController.js    # Lógica de productos
│   └── cartController.js       # Lógica de carritos
├── models/
│   ├── Product.js              # Modelo de productos
│   └── Cart.js                 # Modelo de carritos
├── routes/
│   ├── products.routes.js      # Rutas de productos
│   ├── carts.routes.js         # Rutas de carritos
│   └── views.routes.js         # Rutas de vistas
├── views/
│   ├── layouts/
│   │   └── main.handlebars     # Layout principal
│   ├── products.handlebars     # Vista de productos
│   ├── productDetail.handlebars # Vista de detalle
│   ├── addProduct.handlebars   # Formulario de producto
│   └── cart.handlebars         # Vista del carrito
├── public/
│   └── css/
│       └── styles.css          # Estilos globales
├── config/
│   └── db.js                   # Configuración de BD
├── app.js                      # Configuración de Express
└── server.js                   # Servidor principal
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo con nodemon
npm run dev

# Iniciar servidor
npm start

# Cargar datos de ejemplo
npm run seed

# Instalar dependencias
npm install
```

## 🌟 Funcionalidades Destacadas

### **Paginación Avanzada**
- Límite personalizable de elementos por página
- Navegación con enlaces directos
- Información de páginas totales y actual
- Persistencia de filtros en la navegación

### **Filtros Inteligentes**
- Filtro por categorías predefinidas
- Filtro de productos disponibles (con stock)
- Ordenamiento por precio
- Combinación de múltiples filtros

### **Validaciones Robustas**
- Códigos de producto únicos
- Validación de precios y stock positivos
- Categorías válidas
- URLs de imágenes válidas

### **Experiencia de Usuario**
- Formularios con validación en tiempo real
- Vista previa de imágenes
- Generación automática de códigos
- Diseño responsive y accesible

## 🚀 Próximas Mejoras

- [ ] Sistema de autenticación de usuarios
- [ ] Proceso de checkout completo
- [ ] Sistema de reviews y ratings
- [ ] Búsqueda por texto
- [ ] Dashboard administrativo
- [ ] Integración con pasarelas de pago
- [ ] Sistema de notificaciones
- [ ] API de reportes y analytics

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Mariana** - [GitHub](https://github.com/tu-usuario)

---

⭐ **¡Si este proyecto te fue útil, no olvides darle una estrella!** ⭐
