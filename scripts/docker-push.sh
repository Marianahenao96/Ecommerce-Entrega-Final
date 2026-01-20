#!/bin/bash

# Script para subir la imagen de Docker a Dockerhub
# Uso: ./scripts/docker-push.sh [tu-usuario-dockerhub]

DOCKER_USER=${1:-tu-usuario}
IMAGE_NAME="pet-ecommerce"
VERSION="latest"

echo "🔐 Verificando login en Dockerhub..."
docker login

if [ $? -eq 0 ]; then
    echo "📤 Subiendo imagen a Dockerhub..."
    docker push ${DOCKER_USER}/${IMAGE_NAME}:${VERSION}
    
    if [ $? -eq 0 ]; then
        echo "✅ Imagen subida exitosamente"
        echo ""
        echo "🔗 Tu imagen está disponible en:"
        echo "   https://hub.docker.com/r/${DOCKER_USER}/${IMAGE_NAME}"
    else
        echo "❌ Error al subir la imagen"
        exit 1
    fi
else
    echo "❌ Error al iniciar sesión en Dockerhub"
    exit 1
fi

