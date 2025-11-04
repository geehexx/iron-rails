# Development Guide

## Prerequisites

- Node.js 20+
- npm 10+

## Commands

- `npm install` — Install dependencies
- `npm run dev` — Start Vite dev server
- `npm test` — Run Vitest unit tests
- `npm run build` — Production build to `dist/`

## Architecture

- ECS pattern: entities in `src/ecs/`, components in `src/components/`, systems in `src/systems/`
- Spatial partitioning: `SpatialGrid` for O(1) proximity queries
- Main loop: `GameScene` orchestrates all systems

## ADRs

See `docs/adr/` for architectural decisions.
