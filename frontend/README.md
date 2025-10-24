# Flex Living Frontend

A modern React application built with TypeScript and Vite for the Flex Living review management system.

## Technology Stack

- **React 19** with TypeScript for type-safe development
- **Vite** for fast build tooling and development server
- **Tailwind CSS** for utility-first styling
- **React Router v7** for client-side routing
- **Heroicons** for consistent iconography
- **Axios** for HTTP client communication

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp env.example .env
   # Edit .env with your API configuration
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Build Configuration

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Code Quality

### ESLint Configuration

This project uses ESLint with TypeScript support. The configuration includes:

- TypeScript-aware linting rules
- React-specific linting rules
- Code formatting and style enforcement

### Recommended ESLint Extensions

For enhanced development experience, consider using these ESLint configurations:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

### React-Specific Linting

For React-specific linting rules, install and configure:

```js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      reactX.configs["recommended-typescript"],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

## React Compiler

The React Compiler is not enabled by default due to performance considerations during development and build processes. To enable it, refer to the [React Compiler documentation](https://react.dev/learn/react-compiler/installation).

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── services/      # API service layer
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── assets/        # Static assets
```

## Environment Variables

Required environment variables:

- `VITE_API_URL`: Backend API base URL

## Deployment

The frontend is configured for production deployment with:

- Optimized build output
- Static asset serving via Nginx
- Environment variable injection
- Docker containerization support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
