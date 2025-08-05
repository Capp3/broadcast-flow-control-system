# Lovable Platform Integration

## Overview

The Broadcast Management System frontend is developed through the [Lovable Platform](https://lovable.dev), a no-code/low-code development environment that integrates with GitHub for version control. This document outlines how Lovable is used in our development workflow and how to work effectively with both Lovable and the synchronized GitHub repository for local development and self-hosting.

## Lovable Project Structure

Our Lovable project is structured to match our React + TypeScript codebase organization:

- **Components**: Reusable UI components using Tailwind CSS and shadcn/ui
- **Pages**: Full page components organized by feature area
- **Contexts**: React context providers for state management
- **Hooks**: Custom React hooks for shared functionality
- **Services**: API service interfaces for backend communication
- **Types**: TypeScript interfaces and types

## Development Options

### Option 1: Lovable Platform Development

#### Accessing the Lovable Project

The Broadcast Management System frontend is available at:
[https://lovable.dev/projects/78845865-e6be-426e-99f7-3b3cc01b4991](https://lovable.dev/projects/78845865-e6be-426e-99f7-3b3cc01b4991)

You will need appropriate access permissions to view and edit the project.

#### Making Changes in Lovable

1. **Visual Editor**: Use Lovable's visual editor to make UI changes directly
2. **Code Editor**: For more complex changes, use the embedded code editor
3. **Component Library**: Utilize the project's component library for consistent UX

#### GitHub Synchronization

Changes made through the Lovable platform are automatically:

1. Committed to our Git repository
2. Tagged with appropriate commit messages
3. Pushed to the designated branch

This ensures that all changes are tracked and the GitHub repository always contains the latest code.

### Option 2: Local Development with GitHub Repository (Recommended for Production)

While Lovable provides a seamless development environment, local development using the GitHub repository is recommended for:

- Teams that prefer working with their own IDE
- Production environments where self-hosting is required
- Custom deployment pipelines and CI/CD integration

#### Setting Up Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd broadcast

# Install dependencies
npm i

# Start the development server
npm run dev
```

#### Local Development Workflow

When working with the GitHub repository:

1. Always pull the latest changes before starting work to get Lovable updates
2. You can make changes directly in your preferred IDE
3. Use standard Git workflow for managing changes
4. Push changes to GitHub when ready

```bash
# Get latest changes from Lovable
git pull origin main

# Make your changes locally...

# Commit and push changes
git add .
git commit -m "Description of changes"
git push origin main
```

#### Managing Conflicts

When working in both environments:

1. Avoid parallel edits to the same files in Lovable and locally
2. If conflicts occur, carefully merge changes preserving functionality
3. Consider designating certain files or components to be edited only in one environment

## Deployment Options

### Option 1: Lovable Deployment

For quick and simple deployment:

1. Navigate to the Lovable project
2. Click on "Share" in the top navigation
3. Select "Publish"
4. Choose the deployment target
5. Follow the deployment wizard

### Option 2: Self-Hosted Deployment (Recommended for Production)

For self-hosting the application:

```bash
# Build the production version
npm run build

# The built files will be in the dist/ directory
# Deploy these files to your preferred hosting provider
```

Self-hosting options include:

- **Static Site Hosts**: Netlify, Vercel, GitHub Pages
- **Cloud Providers**: AWS S3 + CloudFront, Google Cloud Storage + Load Balancer
- **Traditional Hosting**: Apache/Nginx on your own servers

## API Integration

The frontend communicates with our Django backend through REST API endpoints. When working locally:

1. Update the `.env` file with appropriate API endpoints
2. Ensure CORS is properly configured on the backend
3. Use proxy settings in `vite.config.ts` for local API connections

## Troubleshooting

### Common Issues

1. **Git Conflicts**: When changes are made in both Lovable and locally
   - Solution: Pull before making local changes, resolve conflicts carefully

2. **API Connection Errors**: When the backend endpoint configuration is incorrect
   - Solution: Verify API URLs in environment settings

3. **Build Issues**: When dependencies are out of sync
   - Solution: Run `npm i` to update dependencies

### Getting Support

If you encounter issues:

1. Check the Lovable documentation at [https://docs.lovable.dev](https://docs.lovable.dev)
2. Contact the project's frontend lead
3. Submit a support request through the Lovable platform

## Best Practices

1. **Repository Synchronization**: Treat the GitHub repo as the source of truth
2. **Environment Configuration**: Use environment variables for different environments
3. **Dependency Management**: Keep package.json updated and synchronized
4. **Build Process**: Document build flags and optimizations
5. **Deployment Documentation**: Keep deployment procedures updated
