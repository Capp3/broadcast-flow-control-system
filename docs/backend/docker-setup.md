# Docker Configuration Guide

## Overview

This document provides detailed information on the Docker configuration for the Broadcast Management System backend. The system uses Docker and Docker Compose to create a consistent development and production environment.

## Docker Services

The backend architecture consists of the following containerized services:

1. **Django Web Application**
2. **PostgreSQL Database**
3. **Redis** (for caching and message broker)
4. **Celery Workers** (for background tasks)
5. **Celery Beat** (for scheduled tasks)

## Docker Compose Configuration

### Development Environment

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env.db
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=broadcast
    ports:
      - "5432:5432"
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - backend-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      
  web:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/mediafiles
    env_file:
      - ./.env.dev
    environment:
      - DEBUG=1
      - SECRET_KEY=devsecretkey
      - DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
      - SQL_ENGINE=django.db.backends.postgresql
      - SQL_DATABASE=broadcast
      - SQL_USER=postgres
      - SQL_PASSWORD=postgres
      - SQL_HOST=db
      - SQL_PORT=5432
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    networks:
      - backend-network
    restart: unless-stopped
      
  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    command: celery -A backend worker -l INFO
    volumes:
      - ./backend:/app
    env_file:
      - ./.env.dev
    environment:
      - DEBUG=1
      - DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - web
      - redis
      - db
    networks:
      - backend-network
    restart: unless-stopped

  celery-beat:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    command: celery -A backend beat -l INFO
    volumes:
      - ./backend:/app
    env_file:
      - ./.env.dev
    environment:
      - DEBUG=1
      - DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - web
      - redis
      - db
    networks:
      - backend-network
    restart: unless-stopped

volumes:
  postgres_data:
  static_volume:
  media_volume:

networks:
  backend-network:
    driver: bridge
```

### Production Environment

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env.prod.db
    networks:
      - backend-network
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      
  redis:
    image: redis:alpine
    networks:
      - backend-network
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      
  web:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    command: gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/mediafiles
    env_file:
      - ./.env.prod
    networks:
      - backend-network
    depends_on:
      - db
      - redis
    restart: always
      
  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    command: celery -A backend worker -l INFO
    env_file:
      - ./.env.prod
    networks:
      - backend-network
    depends_on:
      - web
      - redis
      - db
    restart: always

  celery-beat:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    command: celery -A backend beat -l INFO
    env_file:
      - ./.env.prod
    networks:
      - backend-network
    depends_on:
      - web
      - redis
      - db
    restart: always
      
  nginx:
    build: ./nginx
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/mediafiles
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
    ports:
      - "80:80"
      - "443:443"
    networks:
      - backend-network
    depends_on:
      - web
    restart: always

volumes:
  postgres_data:
  static_volume:
  media_volume:

networks:
  backend-network:
    driver: bridge
```

## Dockerfile Configurations

### Development Dockerfile

```dockerfile
# Dockerfile.dev
FROM python:3.10-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEVELOPMENT=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy entrypoint script
COPY ./entrypoint.dev.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Run entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
```

### Production Dockerfile

```dockerfile
# Dockerfile.prod
FROM python:3.10-slim as builder

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create Python virtual environment
RUN python -m venv /venv

# Install Python dependencies
COPY requirements.txt .
RUN /venv/bin/pip install --upgrade pip \
    && /venv/bin/pip install -r requirements.txt


# Final stage
FROM python:3.10-slim

# Create non-root user
RUN useradd -m appuser

# Set working directory and ownership
WORKDIR /app
RUN chown -R appuser:appuser /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PRODUCTION=1
ENV PATH="/venv/bin:$PATH"

# Install runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /venv /venv

# Copy application code
COPY --chown=appuser:appuser . .

# Copy entrypoint script
COPY --chown=appuser:appuser ./entrypoint.prod.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch to non-root user
USER appuser

# Run entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
```

## Entrypoint Scripts

### Development Entrypoint

```bash
#!/bin/bash
# entrypoint.dev.sh

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! nc -z $SQL_HOST $SQL_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

# Run migrations
python manage.py migrate

# Create superuser if needed
python manage.py createsuperuser --noinput || true

# Collect static files
python manage.py collectstatic --no-input

exec "$@"
```

### Production Entrypoint

```bash
#!/bin/bash
# entrypoint.prod.sh

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! nc -z $SQL_HOST $SQL_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

exec "$@"
```

## Environment Variables

### Development Environment (.env.dev)

```
DEBUG=1
SECRET_KEY=devsecretkey
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]

# Database settings
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=broadcast
SQL_USER=postgres
SQL_PASSWORD=postgres
SQL_HOST=db
SQL_PORT=5432

# Redis settings
REDIS_HOST=redis
REDIS_PORT=6379

# Email settings
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Production Environment (.env.prod)

```
DEBUG=0
SECRET_KEY=your-production-secret-key
DJANGO_ALLOWED_HOSTS=yourdomain.com www.yourdomain.com

# Database settings
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=broadcast_prod
SQL_USER=broadcast_user
SQL_PASSWORD=secure-password
SQL_HOST=db
SQL_PORT=5432

# Redis settings
REDIS_HOST=redis
REDIS_PORT=6379

# Email settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USE_TLS=1
EMAIL_HOST_USER=your-email@yourdomain.com
EMAIL_HOST_PASSWORD=your-email-password
```

### Database Environment (.env.prod.db)

```
POSTGRES_USER=broadcast_user
POSTGRES_PASSWORD=secure-password
POSTGRES_DB=broadcast_prod
```

## NGINX Configuration

```nginx
# /nginx/conf.d/default.conf
upstream django {
    server web:8000;
}

server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /static/ {
        alias /app/staticfiles/;
    }
    
    location /media/ {
        alias /app/mediafiles/;
    }
}
```

## Development Workflow

### Starting the Development Environment

```bash
# Clone the repository
git clone https://github.com/your-org/broadcast.git
cd broadcast

# Copy environment files
cp .env.example .env.dev
cp .env.db.example .env.db

# Start the Docker containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### Running Django Management Commands

```bash
# Create migrations
docker-compose exec web python manage.py makemigrations

# Apply migrations
docker-compose exec web python manage.py migrate

# Create a superuser
docker-compose exec web python manage.py createsuperuser

# Collect static files
docker-compose exec web python manage.py collectstatic --no-input
```

### Accessing Services

- Django Admin: http://localhost:8000/admin/
- API: http://localhost:8000/api/
- PostgreSQL: localhost:5432 (using database client)
- Redis: localhost:6379 (using Redis client)

## Deployment Process

### Staging Deployment

```bash
# Deploy to staging
docker-compose -f docker-compose.staging.yml up -d

# Verify deployment
docker-compose -f docker-compose.staging.yml logs
```

### Production Deployment

```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
docker-compose -f docker-compose.prod.yml logs
```

## Backup and Restore

### Database Backup

```bash
# Create a backup
docker-compose exec db pg_dump -U postgres broadcast > backup.sql

# Schedule regular backups with cron
# Example cron job (daily at 2 AM)
# 0 2 * * * docker-compose -f /path/to/docker-compose.yml exec -T db pg_dump -U postgres broadcast > /path/to/backups/broadcast_$(date +\%Y\%m\%d).sql
```

### Database Restore

```bash
# Restore from a backup
cat backup.sql | docker-compose exec -T db psql -U postgres broadcast
```

## Maintenance

### Updating Containers

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart containers
docker-compose up -d --build
```

### Monitoring Containers

```bash
# Check container status
docker-compose ps

# View resource usage
docker stats
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check if PostgreSQL container is running
   - Verify environment variables in .env files
   - Check network configuration

2. **Static Files Not Loading**:
   - Ensure collectstatic has been run
   - Check NGINX configuration
   - Verify volume mounts

3. **Application Errors**:
   - Check application logs: `docker-compose logs web`
   - Verify Django settings
   - Check for migrations that need to be applied

### Debug Mode

For development, enable more verbose logging by setting:

```
DEBUG=1
```

For production, always ensure:

```
DEBUG=0
```

## Conclusion

This Docker configuration provides a robust, scalable, and maintainable environment for the Broadcast Management System backend. By following the practices outlined in this document, developers can ensure consistent environments across development, staging, and production. 