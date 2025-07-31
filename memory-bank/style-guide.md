# Style Guide

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define interfaces for props and state
- Use type inference where possible
- Avoid `any` type
- Use meaningful variable and function names
- Follow ES6+ conventions

### React Components

- Functional components with hooks
- Props interface defined above component
- Destructure props
- Use named exports
- Group related components in directories
- Keep components focused on a single responsibility

### File Structure

- One component per file for larger components
- Related utilities grouped in utility files
- Consistent naming:
  - PascalCase for components
  - camelCase for variables and functions
  - kebab-case for file names

### Imports

- Group imports by type:
  1. React and libraries
  2. Components
  3. Types
  4. Utils/Hooks
  5. Assets

## UI Style

### Colors

- Use the Tailwind color palette
- Primary: blue-600
- Secondary: gray-500
- Accent: emerald-500
- Error: red-600
- Warning: amber-500
- Success: green-500

### Typography

- Font family: Inter (sans-serif)
- Headings: font-bold
- Body text: font-normal
- Use Tailwind's size classes (text-sm, text-base, etc.)
- Line heights: leading-normal for body, leading-tight for headings

### Spacing

- Use Tailwind's spacing scale
- Consistent padding/margin with p-4, m-4, etc.
- Maintain reasonable whitespace between elements

### Component Guidelines

- Use shadcn/ui components as the foundation
- Maintain accessibility with proper labels, ARIA attributes
- Ensure responsive design for all components
- Use consistent component styling across the application

## Form Guidelines

- Label all form fields
- Show validation errors inline
- Required fields should be clearly marked
- Consistent button styling for actions
- Clear success/error feedback

## Animation

- Subtle transitions for state changes
- Use motion sparingly
- Ensure animations don't interfere with usability
- Respect reduced motion preferences 