#!/bin/bash

chmod -R 775 .

composer install --no-dev --optimize-autoloader

php artisan config:clear
php artisan config:cache

php artisan migrate --force