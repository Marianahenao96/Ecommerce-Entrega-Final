#!/bin/bash

# Script para construir y subir la imagen de Docker a Dockerhub
# Uso: ./scripts/docker-build.sh [tu-usuario-dockerhub]

DOCKER_USER=${1:-tu-usuario}
IMAGE_NAME="pet-ecommerce"
VERSION="latest"

echo "🐳 Construyendo imagen de Docker..."
docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${VERSION} .

if [ $? -eq 0 ]; then
    echo "✅ Imagen construida exitosamente"
    echo ""
    echo "📤 Para subir la imagen a Dockerhub, ejecuta:"
    echo "   docker login"
    echo "   docker push ${DOCKER_USER}/${IMAGE_NAME}:${VERSION}"
else
    echo "❌ Error al construir la imagen"
    exit 1
fi

