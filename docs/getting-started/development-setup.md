# Development Setup

This guide will help you set up the development environment for the Broadcast Management System.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git
- Python 3.11+ (for documentation)
- Docker (for backend development)

## Frontend Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/broadcast.git
cd broadcast
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173`.

### 4. Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Documentation Development

### 1. Install MkDocs Dependencies

```bash
pip install -r requirements-docs.txt
```

### 2. Serve Documentation Locally

```bash
mkdocs serve
```

The documentation will be available at `http://localhost:8000`.

### 3. Build Documentation

```bash
mkdocs build
```

### 4. Documentation Structure

```
docs/
├── index.md                    # Main documentation page
├── getting-started/            # Setup and installation guides
├── frontend/                   # Frontend documentation
│   ├── architecture.md
│   ├── components/
│   ├── pages/
│   └── types.md
├── backend/                    # Backend documentation
├── implementation/             # Implementation plan
├── api/                        # API reference
└── development/               # Development guides
```

## Backend Development Setup (Future)

When the backend is implemented, you'll be able to set up the full development environment:

### 1. Start Backend Services

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Run Database Migrations

```bash
docker-compose exec web python manage.py migrate
```

### 3. Create Superuser

```bash
docker-compose exec web python manage.py createsuperuser
```

### 4. Access Services

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Admin Interface: `http://localhost:8000/admin`
- Documentation: `http://localhost:8001`

## Development Workflow

### 1. Feature Development

1. Create a feature branch from `main`
2. Make your changes
3. Test locally
4. Submit a pull request

### 2. Documentation Updates

1. Edit documentation files in the `docs/` directory
2. Test locally with `mkdocs serve`
3. Documentation will auto-deploy on merge to main

### 3. Code Quality

The project enforces code quality through:

- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## Environment Configuration

### Frontend Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

### Backend Environment Variables (Future)

When setting up the backend:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/broadcast
REDIS_URL=redis://localhost:6379/0

# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

#### Node Modules Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Clear TypeScript cache
npx tsc --build --clean

# Restart TypeScript server in VS Code
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

### Getting Help

- Check the [FAQ](overview.md#faq)
- Review existing [GitHub Issues](https://github.com/your-org/broadcast/issues)
- Check the [troubleshooting guide](../development/debugging.md)
- Submit a new issue if needed

## IDE Setup

### VS Code (Recommended)

Install these extensions:

- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens

### Settings

Add to your VS Code settings:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Next Steps

1. [Frontend Architecture](../frontend/architecture.md) - Understand the application structure
2. [Component Overview](../frontend/components/overview.md) - Learn about the component system
3. [Contributing Guide](../development/contributing.md) - How to contribute to the project 