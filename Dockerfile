# Usar imagen base de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto
EXPOSE 8080

# Variable de entorno para el puerto
ENV PORT=8080
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"]

