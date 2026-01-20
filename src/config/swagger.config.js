import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Ecommerce API',
      version: '1.0.0',
      description: 'API RESTful para tienda de mascotas con autenticación JWT, gestión de productos, carritos y compras',
      contact: {
        name: 'Pet Ecommerce',
        email: 'support@petecommerce.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint de login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'age', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario',
              example: '507f1f77bcf86cd799439011'
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario (único)',
              example: 'juan@example.com'
            },
            age: {
              type: 'number',
              description: 'Edad del usuario',
              example: 25,
              minimum: 0
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario (encriptada)',
              example: 'password123',
              writeOnly: true
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario',
              example: 'user',
              default: 'user'
            },
            cart: {
              type: 'string',
              description: 'ID del carrito asociado',
              example: '507f1f77bcf86cd799439012'
            },
            pets: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array de IDs de mascotas',
              example: []
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Mensaje de error descriptivo'
            },
            error: {
              type: 'string',
              example: 'Detalles del error'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              example: 'Operación exitosa'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };

