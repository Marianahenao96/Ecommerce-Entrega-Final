# 🛒 Ecommerce API - Backend con Autenticación

API RESTful de ecommerce desarrollada con Node.js, Express y MongoDB. Incluye gestión de productos, carritos de compras, sistema completo de autenticación y autorización con JWT, y vistas web responsivas.

## 📋 Características

- ✅ **CRUD de Productos**: Gestión completa con paginación y filtros
- ✅ **CRUD de Carritos**: Gestión de carritos de compras
- ✅ **CRUD de Usuarios**: Gestión completa de usuarios
- ✅ **Autenticación JWT**: Sistema de login con tokens JWT
- ✅ **Encriptación de Contraseñas**: Usando bcrypt.hashSync
- ✅ **Estrategias Passport**: Autenticación y autorización con Passport.js
- ✅ **Vistas Web**: Interfaz web con Handlebars (login, registro, perfil)
- ✅ **API RESTful**: Endpoints completos y documentados

## 🛠️ Tecnologías

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Passport.js** + **JWT** (jsonwebtoken, passport-jwt)
- **bcrypt** (encriptación de contraseñas)
- **Handlebars** (templates)
- **Bootstrap 5** (UI)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd ecommerce_entrega_final
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
PORT=8080
JWT_SECRET=tu_secret_key_super_segura_cambiar_en_produccion
```

### 4. Ejecutar el proyecto

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:8080`

## 📡 Endpoints de la API

### **Usuarios**

#### Crear usuario
```http
POST /api/users
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123",
  "role": "user"
}
```

#### Obtener usuarios
```http
GET /api/users              # Todos los usuarios
GET /api/users/:uid         # Usuario por ID
```

#### Actualizar usuario
```http
PUT /api/users/:uid
Content-Type: application/json

{
  "first_name": "Juan Carlos",
  "age": 26
}
```

#### Eliminar usuario
```http
DELETE /api/users/:uid
```

### **Sesiones (Autenticación)**

#### Login
```http
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Obtener usuario actual
```http
GET /api/sessions/current
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "status": "success",
  "user": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": "..."
  }
}
```

### **Productos**

```http
GET    /products/api              # Listar productos (con paginación)
GET    /products/api/:pid         # Obtener producto por ID
POST   /products/api              # Crear producto
PUT    /products/api/:pid          # Actualizar producto
DELETE /products/api/:pid          # Eliminar producto
```

**Parámetros de consulta para listar:**
- `limit`: Número de productos por página (default: 10)
- `page`: Número de página (default: 1)
- `sort`: Ordenamiento (`asc`/`desc`)
- `query`: Filtro por categoría o `available`

### **Carritos**

```http
POST   /api/carts                           # Crear carrito
GET    /api/carts/:cid                      # Obtener carrito
POST   /api/carts/:cid/products/:pid        # Agregar producto
PUT    /api/carts/:cid/products/:pid        # Actualizar cantidad
DELETE /api/carts/:cid/products/:pid         # Eliminar producto
PUT    /api/carts/:cid                      # Actualizar carrito completo
DELETE /api/carts/:cid                       # Vaciar carrito
```

## 🎨 Vistas Web

- `/products` - Lista de productos con paginación
- `/products/:pid` - Detalle de producto
- `/carts/:cid` - Vista del carrito
- `/register` - Registro de usuario
- `/login` - Inicio de sesión
- `/profile` - Perfil del usuario (requiere autenticación)

## 📁 Estructura del Proyecto

```
src/
├── controllers/
│   ├── productController.js    # Lógica de productos
│   ├── cartController.js       # Lógica de carritos
│   └── userController.js       # Lógica de usuarios y autenticación
├── models/
│   ├── Product.js              # Modelo de productos
│   ├── Cart.js                 # Modelo de carritos
│   └── User.js                 # Modelo de usuarios
├── routes/
│   ├── products.routes.js      # Rutas de productos
│   ├── carts.routes.js         # Rutas de carritos
│   ├── users.routes.js         # Rutas CRUD de usuarios
│   ├── sessions.routes.js      # Rutas de autenticación
│   └── views.routes.js         # Rutas de vistas web
├── views/
│   ├── layouts/
│   │   └── main.handlebars     # Layout principal
│   ├── products.handlebars     # Vista de productos
│   ├── productDetail.handlebars
│   ├── cart.handlebars
│   ├── register.handlebars     # Vista de registro
│   ├── login.handlebars        # Vista de login
│   └── profile.handlebars      # Vista de perfil
├── config/
│   ├── db.js                   # Configuración de BD
│   └── passport.config.js      # Configuración de Passport
├── public/
│   └── css/
│       └── styles.css
├── app.js                      # Configuración de Express
└── server.js                   # Servidor principal
```

## 🔐 Sistema de Autenticación

### Modelo de Usuario

El modelo `User` contiene:
- `first_name`: String (requerido)
- `last_name`: String (requerido)
- `email`: String (requerido, único)
- `age`: Number (requerido)
- `password`: String (requerido, encriptado con bcrypt)
- `cart`: ObjectId (referencia a Cart)
- `role`: String (default: 'user', valores: 'user' o 'admin')

### Encriptación de Contraseñas

- Las contraseñas se encriptan automáticamente usando `bcrypt.hashSync` antes de guardarse
- El hash se genera con un factor de costo de 10
- La encriptación ocurre en el hook `pre('save')` del modelo

### Estrategias de Passport

- **Estrategia `jwt`**: Para autenticación general con tokens JWT
- **Estrategia `current`**: Para validar usuarios logueados en `/api/sessions/current`
- Ambas estrategias buscan el usuario usando el `userId` del payload del token

### Sistema de Login

1. El usuario envía email y contraseña a `POST /api/sessions/login`
2. Se valida la contraseña usando `bcrypt.compareSync`
3. Se genera un token JWT con el ID del usuario
4. El token expira en 24 horas
5. El token debe enviarse en el header: `Authorization: Bearer <token>`

### Ruta de Validación

- `GET /api/sessions/current`: Valida el token JWT y devuelve los datos del usuario
- Usa la estrategia `current` de Passport
- Retorna error 401 si el token es inválido o no existe

## 📝 Scripts Disponibles

```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm run seed     # Cargar datos de ejemplo
```

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt.hashSync
- Tokens JWT con expiración de 24 horas
- Validación de tokens en rutas protegidas
- Estrategias de Passport para autenticación
- Manejo seguro de errores de autenticación

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Mariana**

---

⭐ **¡Si este proyecto te fue útil, no olvides darle una estrella!** ⭐
