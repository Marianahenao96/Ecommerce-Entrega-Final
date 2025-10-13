import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

// 🔹 Rutas
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // ✅ Permite DELETE/PUT desde formularios

// 🔹 Configuración Handlebars
app.engine(
  'handlebars',
  engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    helpers: {
      multiply: (a, b) => a * b,
      eq: (a, b) => a === b,
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 🔹 Rutas principales
app.use('/products', productsRouter); // 👈 Aquí es donde renderiza los productos
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// 🔹 Redirección principal
app.get('/', (req, res) => res.redirect('/products'));

// 🔹 Endpoint de salud
app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;
