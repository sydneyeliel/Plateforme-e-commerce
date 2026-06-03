#!/bin/sh
set -e

# Créer le fichier SQLite s'il n'existe pas encore
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Lancer les migrations
php artisan migrate --force

# Lien symbolique storage -> public/storage
php artisan storage:link --force 2>/dev/null || true

# Vider et reconstruire les caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
