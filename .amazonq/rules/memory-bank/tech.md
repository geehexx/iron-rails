# Technology Stack

## Programming Languages

- **TypeScript 5.6.3**: Primary language with strict type checking
- **JavaScript (ESNext)**: Target compilation output

## Core Dependencies

### Game Framework
- **Phaser 3.87.0**: 2D game framework for rendering, physics, and scene management

## Development Dependencies

### Build Tools
- **Vite 6.0.1**: Fast build tool and dev server
- **TypeScript Compiler**: Type checking and compilation

### Testing
- **Vitest 2.1.9**: Unit testing framework
- **jsdom 27.1.0**: DOM implementation for testing

### Code Quality
- **Husky 9.1.7**: Git hooks management
- **lint-staged 16.2.6**: Pre-commit linting
- **markdownlint-cli2 0.18.1**: Markdown linting

## TypeScript Configuration

### Compiler Options
- **Target**: ESNext
- **Module**: ESNext with bundler resolution
- **Strict Mode**: Enabled
- **noUncheckedIndexedAccess**: Enabled for array safety
- **Library**: ESNext + DOM
- **Output**: `./dist`
- **Root**: `./src`

## Development Commands

```bash
npm run dev      # Start development server (localhost:5173)
npm run build    # Production build (TypeScript + Vite)
npm run preview  # Preview production build
npm test         # Run unit tests with Vitest
```

## Build System

- **Module Type**: ES Modules
- **Bundler**: Vite with TypeScript support
- **Output**: Optimized production bundle in `dist/`

## Version Control

- **Git**: Version control
- **GitHub**: Repository hosting
- **CI/CD**: GitHub Actions workflow (`.github/workflows/ci.yml`)

## Development Environment

- **Entry Point**: `index.html` → `src/main.ts`
- **Dev Server**: Vite dev server with HMR
- **Type Checking**: Strict TypeScript with no unchecked indexed access

## Code Quality Tools

- **Pre-commit Hooks**: Automatic markdown linting via Husky
- **Markdown Standards**: Enforced via markdownlint-cli2
- **Configuration Files**:
  - `.markdownlint.json`: Markdown rules
  - `.markdownlintignore`: Excluded files
  - `tsconfig.json`: TypeScript configuration
  - `vite.config.ts`: Vite build configuration
  - `vitest.config.ts`: Test configuration
