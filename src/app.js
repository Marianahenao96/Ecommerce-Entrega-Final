import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

// Passport
import './config/passport.config.js';

// Swagger
import { swaggerSpec, swaggerUi } from './config/swagger.config.js';

// Rutas
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import usersRouter from './routes/users.routes.js';
import passwordResetRouter from './routes/passwordReset.routes.js';
import ticketsRouter from './routes/tickets.routes.js';
import mocksRouter from './routes/mocks.routes.js';
import petsRouter from './routes/pets.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // Permite DELETE/PUT desde formularios

// Configuración Handlebars
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pet Ecommerce API Documentation'
}));

// Rutas principales
app.use('/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api/pets', petsRouter);
app.use('/', viewsRouter);

// Redirección principal
app.get('/', (req, res) => res.redirect('/products'));

// Endpoint de salud
app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;
