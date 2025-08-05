# Broadcast Management System

## Project Overview

The Broadcast Management System (BMS) is a comprehensive platform designed for media organizations to manage broadcast content, scheduling, and operations. The system enables broadcasters to efficiently organize content, create and maintain broadcast schedules, manage user permissions, and automate various aspects of the broadcasting workflow.

## Technology Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Development Platform**: [Lovable](https://lovable.dev/projects/78845865-e6be-426e-99f7-3b3cc01b4991) (with code synchronized to GitHub)

### Backend

- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL 14
- **Caching**: Redis
- **Task Queue**: Celery
- **Authentication**: Session-based with CSRF protection
- **Deployment**: Docker with Docker Compose

## Project Structure

```
broadcast/
├── frontend/                # React frontend (synchronized from Lovable to GitHub)
│   ├── src/                 # Frontend source code
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and constants
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service interfaces
│   │   └── types/           # TypeScript type definitions
├── backend/                 # Django backend
│   ├── app/                 # Django project root
│   │   ├── config/          # Project configuration
│   │   ├── core/            # Core Django app
│   │   └── ...              # Other Django apps
│   ├── Dockerfile           # Docker configuration for Django
│   └── docker-compose.yml   # Docker Compose for development
├── docs/                    # Project documentation (MkDocs)
└── memory-bank/             # Project memory and task tracking
```

## Getting Started

### Frontend Development Options

#### Option 1: Using Lovable Platform

The frontend can be developed through the Lovable development platform. Visit the [Lovable Project](https://lovable.dev/projects/78845865-e6be-426e-99f7-3b3cc01b4991) and start developing.

Changes made via Lovable will be committed automatically to the GitHub repository.

#### Option 2: Self-Hosted Local Development (Recommended for Production)

For local development and self-hosting:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd broadcast

# Install the frontend dependencies
npm i

# Start the frontend development server
npm run dev
```

This approach allows you to work directly with the code that Lovable synchronizes to GitHub and gives you full control over your deployment and hosting.

### Backend Development

```sh
# Navigate to the backend directory
cd backend

# Copy environment files
cp .env.example .env

# Start the Docker containers
docker-compose up -d

# Apply migrations
docker-compose exec web python manage.py migrate

# Create a superuser
docker-compose exec web python manage.py createsuperuser
```

## Documentation

Comprehensive documentation is available in the `docs/` directory and can be built using MkDocs:

```sh
# Install documentation dependencies
pip install -r requirements-docs.txt

# Serve documentation locally
mkdocs serve
```

Visit `http://localhost:8000` to view the documentation.

## Deployment

### Frontend Deployment Options

#### Option 1: Lovable Deployment

Open [Lovable](https://lovable.dev/projects/78845865-e6be-426e-99f7-3b3cc01b4991) and click on Share -> Publish to deploy the frontend through Lovable's platform.

#### Option 2: Self-Hosted Deployment (Recommended for Production)

For complete control over your hosting environment:

```sh
# Build the frontend
npm run build

# Deploy the built files from the dist/ directory to your hosting provider
```

This approach gives you full control over your hosting environment and deployment pipeline.

### Backend Deployment

The backend is containerized with Docker and can be deployed to any container-compatible hosting environment.

```sh
# Production deployment
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

## Development Status

The project is currently in active development:

- ✅ Frontend development with Lovable platform (with GitHub synchronization)
- 🚧 Backend implementation with Django and Docker
- ✅ Documentation system with MkDocs

For detailed information about the development status and upcoming tasks, refer to the project documentation.
