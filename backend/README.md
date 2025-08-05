# Broadcast Backend

Django backend with Celery for the Broadcast Management System.

## Architecture

- **Django**: Web framework with Django REST Framework for API endpoints
- **Celery**: Task queue for background processing
- **PostgreSQL**: Database for data storage
- **Redis**: Message broker for Celery and caching

## Development Setup

1. Copy environment files:
   ```bash
   cp .env.example .env
   cp .env.db.example .env.db
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Create a superuser:
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

4. Access the API at:
   - API: `http://localhost:8000`
   - Admin: `http://localhost:8000/admin`
   - API Documentation: `http://localhost:8000/swagger`

## Configuration

### Environment Variables

The following environment variables can be configured in `.env`:

- `DEBUG`: Set to `True` for development, `False` for production
- `SECRET_KEY`: Django's secret key
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DJANGO_PORT`: Port to expose Django (default: 8000)
- `POSTGRES_PORT`: Port to expose PostgreSQL (default: 5432)
- `REDIS_PORT`: Port to expose Redis (default: 6379)
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of origins for CORS

## Production Deployment

For production deployment:

1. Update `.env` with production settings:
   ```
   DEBUG=False
   SECRET_KEY=your-secure-secret-key
   ALLOWED_HOSTS=your-domain.com
   CORS_ALLOWED_ORIGINS=https://frontend-domain.com
   CSRF_TRUSTED_ORIGINS=https://your-domain.com
   ```

2. Use a production-ready Docker setup:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Cross-Machine Communication

When hosting the backend on a separate machine:

1. Ensure the backend machine's firewall allows traffic on the exposed ports:
   - Django: 8000 (or your custom port)
   - PostgreSQL: 5432 (if needed by frontend)
   - Redis: 6379 (if needed by frontend)

2. Configure the frontend to point to the backend's IP or hostname:
   ```
   API_URL=http://backend-server-ip:8000
   ```

3. Update CORS and CSRF settings in the backend to accept requests from the frontend:
   ```
   CORS_ALLOWED_ORIGINS=http://frontend-server-ip:3000
   CSRF_TRUSTED_ORIGINS=http://frontend-server-ip:3000
   ``` 
