#!/bin/bash
set -e
set -x

composer install --no-interaction --prefer-dist --optimize-autoloader
php artisan config:clear
php artisan migrate --force

npm install
npm run build