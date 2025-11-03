# 05: Recommended Project Setup

This document outlines a recommended technical stack and project structure for the Iron Rails game. The goal is to use modern, efficient, and well-supported tools to enable rapid development while maintaining high code quality.

---

## Recommended Technology Stack

| Component | Recommendation | Rationale |
| :--- | :--- | :--- |
| **Game Framework** | **[Phaser](https://phaser.io/)** | A mature, "batteries-included" 2D game framework that handles rendering (WebGL/Canvas), physics, audio, and asset loading. Its extensive features will significantly accelerate development. |
| **Language** | **[TypeScript](https://www.typescriptlang.org/)** | A superset of JavaScript that adds static typing. Using TypeScript will dramatically reduce bugs, improve code maintainability, and provide a better developer experience with features like autocompletion. |
| **Build Tool / Dev Server** | **[Vite](https://vitejs.dev/)** | A modern, extremely fast build tool and development server. Vite offers near-instantaneous hot module replacement (HMR), first-class TypeScript support, and a simple configuration, making the development loop fast and efficient. |
| **Testing Framework** | **[Vitest](https://vitest.dev/)** | A modern, fast, and Jest-compatible testing framework that integrates seamlessly with Vite. It's perfect for writing unit and integration tests for our game logic. |

---

## Recommended Project Directory Structure

A well-organized directory structure is key to a maintainable codebase.

```bash
iron-rails/
├── public/               # Static assets (e.g., index.html, game assets)
│   ├── assets/
│   │   ├── images/
│   │   └── audio/
│   └── index.html
│
├── src/                  # All TypeScript source code
│   ├── main.ts           # Main entry point of the game
│   │
│   ├── scenes/           # Each distinct game screen (e.g., Boot, Game, UI, Upgrade)
│   │   ├── BootScene.ts
│   │   └── GameScene.ts
│   │
│   ├── gameObjects/      # Reusable game object classes
│   │   ├── Train.ts
│   │   └── Zombie.ts
│   │
│   ├── systems/          # Core game logic systems
│   │   ├── ObjectPool.ts
│   │   └── TargetingSystem.ts
│   │
│   └── types/            # TypeScript type definitions
│       └── index.ts
│
├── tests/                # Vitest test files
│   ├── systems/
│   │   └── ObjectPool.test.ts
│   └── setup.ts          # Test setup file
│
├── .gitignore
├── package.json
├── tsconfig.json         # TypeScript compiler configuration
└── vite.config.ts        # Vite build tool configuration
```

---

## Development Workflow

1. **Setup:**
    - Install [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) (or npm/yarn).
    - Run `pnpm install` to install project dependencies.

2. **Development:**
    - Run `pnpm dev` to start the Vite development server.
    - The game will be accessible in your browser at `http://localhost:5173`.
    - Any changes to the TypeScript code will trigger an instant update in the browser.

3. **Testing:**
    - Run `pnpm test` to run all unit and integration tests with Vitest.
    - Run `pnpm test:watch` to run tests in watch mode, re-running them on any code change.

4. **Building for Production:**
    - Run `pnpm build` to create a production-ready, optimized build of the game in the `/dist` directory.
