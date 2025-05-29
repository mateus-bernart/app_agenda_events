#!/bin/bash

set -e

echo "🔧 Limpando build anterior..."
rm -rf public/build

echo "📦 Instalando dependências do PHP..."
composer install --no-dev --optimize-autoloader

echo "🔁 Rodando migrations..."
php artisan migrate --force || true

echo "🧹 Limpando caches Laravel..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear

echo "⚙️ Gerando caches Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "📦 Instalando dependências do Node..."
npm ci

echo "🛠 Construindo front-end com Vite..."
npm run build

echo "✅ Build completo."