# Iron Rails - Technology Stack

## Programming Languages & Versions
- **TypeScript**: Primary language with strict type checking
- **JavaScript**: ES modules with modern syntax (ESNext target)
- **HTML5**: Canvas-based rendering via Phaser

## Core Dependencies
- **Phaser 3.87.0**: Game engine for 2D graphics, physics, and scene management
- **Vite 6.0.1**: Fast build tool and development server
- **Vitest 2.1.9**: Unit testing framework with TypeScript support

## Development Dependencies
- **TypeScript 5.6.3**: Type checking and compilation
- **Husky 9.1.7**: Git hooks for code quality
- **lint-staged 16.2.6**: Pre-commit linting
- **markdownlint-cli2 0.18.1**: Documentation linting
- **jsdom 27.1.0**: DOM simulation for testing

## Build System & Configuration

### TypeScript Configuration
- **Target**: ESNext for modern JavaScript features
- **Module System**: ESNext with bundler resolution
- **Strict Mode**: Enabled with noUncheckedIndexedAccess
- **Output**: ./dist directory

### Vite Configuration
- **Module Resolution**: Bundler-based for optimal tree shaking
- **Development Server**: Hot module replacement enabled
- **Build Output**: Optimized production bundles

### Testing Setup
- **Framework**: Vitest with jsdom environment
- **Coverage**: Built-in coverage reporting
- **TypeScript**: Native TypeScript support without compilation step

## Development Commands

### Primary Commands
```bash
npm run dev     # Start development server at localhost:5173
npm test        # Run unit tests with Vitest
npm run build   # Production build with TypeScript compilation
npm run preview # Preview production build locally
```

### Quality Assurance
- **Pre-commit Hooks**: Automatic markdown linting via Husky
- **Lint Staged**: Only lint changed files for performance
- **TypeScript Strict**: Comprehensive type checking enabled

## Browser Compatibility
- **Target**: Modern browsers supporting ES modules
- **Canvas**: HTML5 Canvas API via Phaser
- **Storage**: LocalStorage for game state persistence

## Development Environment
- **Node.js**: Required for package management and build tools
- **Git**: Version control with automated quality checks
- **IDE Support**: Full TypeScript intellisense and debugging