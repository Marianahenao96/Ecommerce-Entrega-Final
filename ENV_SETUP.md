# Configuración de Variables de Entorno

Este archivo contiene las variables de entorno necesarias para el correcto funcionamiento de la aplicación.

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# ============================================
# CONFIGURACIÓN DEL SERVIDOR
# ============================================

# Puerto en el que correrá el servidor
PORT=8080

# ============================================
# CONFIGURACIÓN DE MONGODB ATLAS
# ============================================

# MongoDB Atlas Connection String
# Formato: mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombre-base-datos>?retryWrites=true&w=majority
# Ejemplo: mongodb+srv://mi_usuario:mi_password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
# 
# Para obtener tu connection string:
# 1. Ve a MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
# 2. Inicia sesión o crea una cuenta gratuita
# 3. Crea un nuevo cluster (puedes usar el tier gratuito M0)
# 4. Ve a "Database Access" y crea un usuario de base de datos
# 5. Ve a "Network Access" y agrega tu IP (o 0.0.0.0/0 para desarrollo)
# 6. Ve a "Database" > "Connect" > "Connect your application"
# 7. Copia la connection string y reemplaza <password> con tu contraseña
#
# OPCIONAL: Para desarrollo local, puedes usar:
# MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# ============================================
# CONFIGURACIÓN DE JWT (JSON Web Token)
# ============================================

# Secret key para firmar los tokens JWT
# IMPORTANTE: Cambia esto por una clave segura y única en producción
# Puedes generar una clave segura usando: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=tu_secret_key_super_segura_cambiar_en_produccion

# ============================================
# CONFIGURACIÓN DE EMAIL (SMTP)
# ============================================

# Host del servidor SMTP
# Para Gmail: smtp.gmail.com
# Para Outlook: smtp-mail.outlook.com
# Para otros proveedores, consulta su documentación
SMTP_HOST=smtp.gmail.com

# Puerto del servidor SMTP
# 587 para TLS (recomendado)
# 465 para SSL
SMTP_PORT=587

# Si usa SSL (true/false)
# true para puerto 465, false para puerto 587
SMTP_SECURE=false

# Email del remitente (usuario SMTP)
# Este es el email desde el cual se enviarán los correos de recuperación de contraseña
SMTP_USER=tu_email@gmail.com

# Contraseña de aplicación del email
# IMPORTANTE para Gmail:
# 1. Activa la verificación en dos pasos en tu cuenta de Google
# 2. Ve a: https://myaccount.google.com/apppasswords
# 3. Selecciona "Aplicación" > "Correo" y "Dispositivo" > "Otro"
# 4. Ingresa un nombre (ej: "Ecommerce App")
# 5. Copia la contraseña de 16 caracteres generada
# 6. Úsala aquí como SMTP_PASS
SMTP_PASS=tu_contraseña_de_aplicacion_de_16_caracteres

# Nombre que aparecerá como remitente en los emails
EMAIL_FROM_NAME=Ecommerce

# ============================================
# CONFIGURACIÓN DEL FRONTEND
# ============================================

# URL del frontend (para enlaces en emails)
# Esta URL se usa en los emails de recuperación de contraseña
# Cambia esto por la URL de tu frontend en producción
FRONTEND_URL=http://localhost:8080

# ============================================
# NOTAS IMPORTANTES
# ============================================

# 1. NUNCA subas este archivo al repositorio
# 2. Este archivo debe estar en .gitignore
# 3. En producción, usa variables de entorno del servidor o un servicio de gestión de secretos
# 4. Cambia todas las credenciales por valores reales antes de usar la aplicación
# 5. Para MongoDB Atlas, asegúrate de que tu IP esté en la whitelist
```

## Configuración de MongoDB Atlas

### Pasos para configurar MongoDB Atlas:

1. **Crear cuenta en MongoDB Atlas:**
   - Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Inicia sesión o crea una cuenta gratuita

2. **Crear un Cluster:**
   - Selecciona el tier gratuito M0 (Free)
   - Elige una región cercana a tu ubicación
   - Dale un nombre a tu cluster

3. **Configurar acceso a la base de datos:**
   - Ve a "Database Access" en el menú lateral
   - Clic en "Add New Database User"
   - Crea un usuario con contraseña (guarda estas credenciales)
   - Asigna el rol "Atlas admin" o "Read and write to any database"

4. **Configurar Network Access:**
   - Ve a "Network Access" en el menú lateral
   - Clic en "Add IP Address"
   - Para desarrollo, puedes agregar `0.0.0.0/0` (permite acceso desde cualquier IP)
   - En producción, agrega solo las IPs específicas que necesitas

5. **Obtener Connection String:**
   - Ve a "Database" en el menú lateral
   - Clic en "Connect" en tu cluster
   - Selecciona "Connect your application"
   - Copia la connection string
   - Reemplaza `<password>` con la contraseña de tu usuario
   - Reemplaza `<dbname>` con el nombre de tu base de datos (ej: `ecommerce`)

## Configuración de Gmail para Envío de Emails

1. **Activa la verificación en dos pasos:**
   - Ve a tu cuenta de Google: https://myaccount.google.com/
   - Ve a "Seguridad"
   - Activa "Verificación en dos pasos"

2. **Genera una contraseña de aplicación:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Aplicación" > "Correo"
   - Selecciona "Dispositivo" > "Otro (nombre personalizado)"
   - Ingresa un nombre como "Ecommerce App"
   - Clic en "Generar"
   - Copia la contraseña de 16 caracteres (sin espacios)
   - Úsala como `SMTP_PASS` en tu archivo `.env`

## Notas de Seguridad

- **NUNCA** subas el archivo `.env` al repositorio
- El archivo `.env` debe estar en `.gitignore`
- En producción, usa variables de entorno del servidor o un servicio de gestión de secretos
- Cambia todas las credenciales por valores reales antes de usar la aplicación
- Para MongoDB Atlas, en producción solo permite IPs específicas en Network Access
- Genera un `JWT_SECRET` único y seguro para producción

