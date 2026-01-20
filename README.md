# Pet Ecommerce API - Backend con Autenticación

API RESTful de ecommerce para tienda de mascotas desarrollada con Node.js, Express y MongoDB. Incluye gestión de productos, carritos de compras, sistema completo de autenticación y autorización con JWT, y vistas web responsivas.

## 🐳 Docker

### Imagen de Docker en Dockerhub

La imagen de Docker está disponible en Dockerhub:

**🔗 [Ver imagen en Dockerhub](https://hub.docker.com/r/mariana96/pet-ecommerce)**

### Ejecutar con Docker

#### Opción 1: Usar la imagen de Dockerhub

```bash
# Descargar y ejecutar la imagen
docker run -d \
  -p 8080:8080 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/ecommerce \
  -e PORT=8080 \
  -e JWT_SECRET=tu_secret_key_super_segura \
  --name pet-ecommerce \
  mariana96/pet-ecommerce:latest
```

#### Opción 2: Construir la imagen localmente

```bash
# Construir la imagen
docker build -t pet-ecommerce .

# Ejecutar el contenedor
docker run -d \
  -p 8080:8080 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/ecommerce \
  -e PORT=8080 \
  -e JWT_SECRET=tu_secret_key_super_segura \
  --name pet-ecommerce \
  pet-ecommerce
```

#### Opción 3: Usar Docker Compose

```bash
# Ejecutar con docker-compose (requiere archivo docker-compose.yml)
docker-compose up -d
```

### Variables de entorno para Docker

Asegúrate de configurar las siguientes variables de entorno al ejecutar el contenedor:

- `MONGO_URI`: URI de conexión a MongoDB
- `PORT`: Puerto del servidor (default: 8080)
- `JWT_SECRET`: Clave secreta para JWT
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Para servicio de email (opcional)

### Acceder a la aplicación

Una vez ejecutado el contenedor, la aplicación estará disponible en:
- **API**: `http://localhost:8080`
- **Documentación Swagger**: `http://localhost:8080/api-docs`
- **Vistas Web**: `http://localhost:8080/products`

### Subir imagen a Dockerhub

Para subir la imagen a Dockerhub:

```bash
# 1. Iniciar sesión en Dockerhub
docker login

# 2. Construir la imagen con tu nombre de usuario
docker build -t mariana96/pet-ecommerce:latest .

# 3. Subir la imagen
docker push mariana96/pet-ecommerce:latest
```

**Imagen disponible en**: [Dockerhub - mariana96/pet-ecommerce](https://hub.docker.com/r/mariana96/pet-ecommerce)

### Usar Docker Compose

Para ejecutar la aplicación con MongoDB incluido:

```bash
# Ejecutar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## Características

### Funcionalidades Básicas
- **CRUD de Productos**: Gestión completa con paginación y filtros
- **CRUD de Carritos**: Gestión de carritos de compras
- **CRUD de Usuarios**: Gestión completa de usuarios
- **Autenticación JWT**: Sistema de login con tokens JWT
- **Encriptación de Contraseñas**: Usando bcrypt
- **Estrategias Passport**: Autenticación y autorización con Passport.js
- **Vistas Web**: Interfaz web con Handlebars (login, registro, perfil)
- **API RESTful**: Endpoints completos y documentados

### Funcionalidades Avanzadas
- **Patrón Repository**: Implementación de DAOs y Repositories para separar lógica de acceso a datos
- **DTOs (Data Transfer Objects)**: Endpoint `/current` usa DTOs para no exponer información sensible
- **Recuperación de Contraseña**: Sistema completo con envío de emails y tokens expirables (1 hora)
- **Middleware de Autorización**: Control de acceso basado en roles (admin/usuario)
- **Modelo Ticket**: Sistema de compras con verificación de stock y generación de tickets
- **Lógica de Compra**: Procesamiento de compras con manejo de productos disponibles/no disponibles
- **Arquitectura Profesional**: Separación de responsabilidades con capas bien definidas
- **Sistema de Mocking**: Generación de datos de prueba para desarrollo y testing

## Tecnologías

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Passport.js** + **JWT** (jsonwebtoken, passport-jwt)
- **bcrypt** (encriptación de contraseñas)
- **nodemailer** (envío de emails)
- **Handlebars** (templates)
- **Bootstrap 5** (UI)
- **@faker-js/faker** (generación de datos mock)
- **Swagger/OpenAPI** (documentación de API)
- **Jest** + **Supertest** (testing)
- **Docker** (containerización)

## Instalación

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

Crear archivo `.env` en la raíz del proyecto. Ver `ENV_SETUP.md` para la configuración completa.

**Variables mínimas requeridas:**
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
PORT=8080
JWT_SECRET=tu_secret_key_super_segura_cambiar_en_produccion

# Opcional: Para recuperación de contraseña
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
FRONTEND_URL=http://localhost:8080
```

### 4. Ejecutar el proyecto

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:8080`

## 📚 Documentación de API (Swagger)

La documentación completa de la API está disponible en Swagger UI:

**🔗 [Documentación Swagger](http://localhost:8080/api-docs)**

La documentación incluye:
- Todos los endpoints del módulo de **Users** con ejemplos
- Esquemas de datos (schemas)
- Códigos de respuesta
- Ejemplos de requests y responses

### Endpoints documentados en Swagger

- **Users**: CRUD completo de usuarios
  - `POST /api/users` - Crear usuario
  - `GET /api/users` - Obtener todos los usuarios
  - `GET /api/users/:uid` - Obtener usuario por ID
  - `PUT /api/users/:uid` - Actualizar usuario
  - `DELETE /api/users/:uid` - Eliminar usuario

## 🧪 Testing

### Ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Tests implementados

- **Tests funcionales para Pets Router** (`/api/pets`)
  - `GET /api/pets` - Obtener todos los pets
  - `GET /api/pets/:pid` - Obtener pet por ID
  - Casos de éxito y error
  - Validación de respuestas
  - Manejo de errores

## Endpoints de la API

### Usuarios

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

### Sesiones (Autenticación)

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

#### Logout
```http
POST /api/sessions/logout
Authorization: Bearer <token>
```

#### Obtener usuario actual (con DTO)
```http
GET /api/sessions/current
Authorization: Bearer <token>
```

**Respuesta:** (Usa DTO - no incluye información sensible como contraseña)
```json
{
  "status": "success",
  "user": {
    "id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Recuperación de Contraseña

#### Solicitar recuperación de contraseña
```http
POST /api/password-reset/request
Content-Type: application/json

{
  "email": "juan@example.com"
}
```

**Nota:** Por seguridad, siempre devuelve éxito aunque el email no exista.

#### Restablecer contraseña
```http
POST /api/password-reset/reset
Content-Type: application/json

{
  "token": "token_del_email",
  "newPassword": "nueva_contraseña_segura"
}
```

**Características:**
- El token expira después de 1 hora
- No permite usar la misma contraseña anterior
- Envía email con enlace para restablecer

### Productos

**Rutas públicas (sin autenticación):**
```http
GET    /products/api              # Listar productos (con paginación)
GET    /products/api/:pid         # Obtener producto por ID
```

**Rutas protegidas (solo admin):**
```http
POST   /products                  # Crear producto (requiere admin)
PUT    /products/:pid             # Actualizar producto (requiere admin)
DELETE /products/api/:pid         # Eliminar producto (requiere admin)
DELETE /products/:pid             # Eliminar producto (requiere admin)
```

**Parámetros de consulta para listar:**
- `limit`: Número de productos por página (default: 10)
- `page`: Número de página (default: 1)
- `sort`: Ordenamiento (`asc`/`desc`)
- `query`: Filtro por categoría o `available`

**Autorización:**
- Solo usuarios con rol `admin` pueden crear, actualizar y eliminar productos
- Todos pueden ver y listar productos

### Carritos

```http
POST   /api/carts                           # Crear carrito
GET    /api/carts/:cid                      # Obtener carrito
POST   /api/carts/:cid/products/:pid        # Agregar producto (solo usuarios)
PUT    /api/carts/:cid/products/:pid        # Actualizar cantidad
DELETE /api/carts/:cid/products/:pid        # Eliminar producto
PUT    /api/carts/:cid                      # Actualizar carrito completo
DELETE /api/carts/:cid                      # Vaciar carrito
```

**Autorización:**
- Solo usuarios con rol `user` pueden agregar productos al carrito
- Los administradores no pueden agregar productos al carrito

### Tickets (Compras)

```http
POST   /api/tickets/carts/:cid/purchase     # Procesar compra del carrito (solo usuarios)
GET    /api/tickets/mytickets               # Obtener mis tickets
GET    /api/tickets/:tid                    # Obtener ticket por ID
```

**Características:**
- Verifica stock antes de procesar la compra
- Genera tickets con productos disponibles y no disponibles
- Actualiza el stock de productos comprados
- Maneja compras parciales (algunos productos sin stock)

### Mocking (Generación de Datos)

```http
GET    /api/mocks/mockingpets               # Generar pets mockeados (sin insertar)
GET    /api/mocks/mockingusers              # Generar 50 usuarios mockeados (sin insertar)
POST   /api/mocks/generateData              # Generar e insertar datos en la BD
```

**POST /api/mocks/generateData:**
```json
{
  "users": 10,
  "pets": 20
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Datos generados e insertados en la base de datos",
  "results": {
    "users": {
      "requested": 10,
      "created": 10
    },
    "pets": {
      "requested": 20,
      "created": 20
    }
  }
}
```

**Características de usuarios mockeados:**
- Contraseña: "coder123" (encriptada)
- Role: aleatorio entre "user" y "admin"
- Campo `pets`: array vacío

### Pets

```http
GET    /api/pets                            # Listar todos los pets
GET    /api/pets/:pid                       # Obtener pet por ID
```

## Vistas Web

- `/products` - Lista de productos con paginación
- `/products/:pid` - Detalle de producto
- `/carts/:cid` - Vista del carrito
- `/register` - Registro de usuario
- `/login` - Inicio de sesión
- `/profile` - Perfil del usuario (requiere autenticación)

## Estructura del Proyecto

```
src/
├── controllers/
│   ├── productController.js      # Lógica de productos
│   ├── cartController.js         # Lógica de carritos
│   ├── userController.js         # Lógica de usuarios y autenticación
│   ├── passwordResetController.js # Lógica de recuperación de contraseña
│   ├── ticketController.js       # Lógica de tickets/compras
│   └── mocksController.js        # Lógica de mocking
├── dao/                           # Data Access Objects (DAO)
│   ├── userDAO.js
│   ├── productDAO.js
│   ├── cartDAO.js
│   └── ticketDAO.js
├── repositories/                  # Repositories (lógica de negocio)
│   ├── userRepository.js
│   ├── productRepository.js
│   ├── cartRepository.js
│   └── ticketRepository.js
├── services/                      # Servicios de negocio
│   ├── emailService.js           # Servicio de envío de emails
│   ├── passwordResetService.js   # Servicio de recuperación
│   └── purchaseService.js        # Servicio de compras
├── utils/                         # Utilidades
│   └── mockingUtils.js           # Utilidades de mocking
├── dto/                           # Data Transfer Objects
│   └── userDTO.js
├── middlewares/
│   ├── auth.js                   # Middleware de autenticación
│   └── authorization.js          # Middlewares de autorización
├── models/
│   ├── Product.js                # Modelo de productos
│   ├── Cart.js                   # Modelo de carritos
│   ├── User.js                   # Modelo de usuarios
│   ├── Ticket.js                 # Modelo de tickets
│   └── Pet.js                    # Modelo de pets
├── routes/
│   ├── products.routes.js        # Rutas de productos
│   ├── carts.routes.js           # Rutas de carritos
│   ├── users.routes.js           # Rutas CRUD de usuarios
│   ├── sessions.routes.js        # Rutas de autenticación
│   ├── passwordReset.routes.js   # Rutas de recuperación
│   ├── tickets.routes.js         # Rutas de tickets
│   ├── mocks.routes.js           # Rutas de mocking
│   ├── pets.routes.js            # Rutas de pets
│   └── views.routes.js           # Rutas de vistas web
├── views/
│   ├── layouts/
│   │   └── main.handlebars       # Layout principal
│   ├── products.handlebars       # Vista de productos
│   ├── productDetail.handlebars
│   ├── cart.handlebars
│   ├── addProduct.handlebars
│   ├── register.handlebars       # Vista de registro
│   ├── login.handlebars          # Vista de login
│   └── profile.handlebars        # Vista de perfil
├── config/
│   ├── db.js                     # Configuración de BD
│   ├── passport.config.js        # Configuración de Passport
│   └── swagger.config.js         # Configuración de Swagger
├── tests/
│   └── pets.test.js              # Tests funcionales de pets
├── public/
│   └── css/
│       └── styles.css
├── app.js                        # Configuración de Express
└── server.js                     # Servidor principal
├── Dockerfile                    # Configuración de Docker
├── .dockerignore                 # Archivos ignorados en Docker
├── jest.config.js                # Configuración de Jest
└── package.json                  # Dependencias y scripts
```

## Sistema de Autenticación

### Modelo de Usuario

El modelo `User` contiene:
- `first_name`: String (requerido)
- `last_name`: String (requerido)
- `email`: String (requerido, único)
- `age`: Number (requerido)
- `password`: String (requerido, encriptado con bcrypt)
- `cart`: ObjectId (referencia a Cart)
- `role`: String (default: 'user', valores: 'user' o 'admin')
- `pets`: Array de ObjectIds (referencia a Pet, default: [])

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
- Usa DTO para no exponer información sensible

## Scripts Disponibles

```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm run seed     # Cargar datos de ejemplo
```

## Seguridad y Autorización

- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración de 24 horas
- Validación de tokens en rutas protegidas
- Estrategias de Passport para autenticación
- Manejo seguro de errores de autenticación
- **Middleware de autorización por roles:**
  - `isAdmin`: Solo administradores
  - `isUser`: Solo usuarios regulares (no admin)
  - Control de acceso granular a endpoints
- **DTOs**: Protección de información sensible en respuestas
- **Tokens de recuperación**: Expiran después de 1 hora
- **Validación de contraseñas**: No permite reutilizar contraseñas anteriores

## Arquitectura

El proyecto implementa una arquitectura profesional con:

- **Patrón Repository**: Separa la lógica de acceso a datos de la lógica de negocio
- **DAOs (Data Access Objects)**: Abstracción de las operaciones de base de datos
- **DTOs (Data Transfer Objects)**: Transferencia segura de datos entre capas
- **Servicios**: Lógica de negocio reutilizable
- **Middlewares**: Autorización y validación centralizadas
- **Separación de responsabilidades**: Cada capa tiene su función específica

## Licencia

Este proyecto está bajo la Licencia MIT.

## Autor

**Mariana**
