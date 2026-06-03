# ── Stage 1 : build des assets React/Vite ─────────────────────────────────────
FROM node:22-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2 : application PHP-FPM ─────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS app

WORKDIR /var/www/html

# Extensions PHP nécessaires
RUN apk add --no-cache \
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

# Copier les sources
COPY . .

# Récupérer le build Vite depuis le stage frontend
COPY --from=frontend /app/public/build ./public/build

# Dépendances PHP (sans dev)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]
