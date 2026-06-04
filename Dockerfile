# ── Stage 1 : build assets React/Vite ─────────────────────────────────────────
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2 : application (nginx + PHP-FPM dans un seul container) ─────────────
FROM php:8.3-fpm-alpine AS app

WORKDIR /var/www/html

# Nginx + Supervisor + extensions PHP
RUN apk add --no-cache \
        nginx \
        supervisor \
        git \
        curl \
        libzip-dev \
        sqlite-dev \
        unzip \
    && docker-php-ext-install \
        pdo \
        pdo_sqlite \
        zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Sources
COPY . .

# Assets Vite buildés
COPY --from=frontend /app/public/build ./public/build

# Dépendances PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Config nginx
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Config supervisor
COPY docker/supervisord.conf /etc/supervisord.conf

# Permissions
RUN mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && mkdir -p /run/nginx

# Entrypoint
RUN printf '#!/bin/sh\nset -e\nif [ ! -f /var/www/html/database/database.sqlite ]; then\n  touch /var/www/html/database/database.sqlite\nfi\nphp artisan migrate --force\nphp artisan storage:link --force 2>/dev/null || true\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache\nexec "$@"\n' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
