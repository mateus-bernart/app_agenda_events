#!/bin/bash

set -e

# Limpa o build anterior
rm -rf public/build

composer install --no-dev --optimize-autoloader

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

npm ci
npm run build