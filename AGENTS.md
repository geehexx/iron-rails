# Agent Instructions for Iron Rails

Core guidelines for AI agents working on this codebase. Optimized for LLM consumption.

## Core Principles

1. **Documentation-First**: `/docs` is single source of truth. Never implement features not in active initiative.
2. **Follow Active Initiative**: Check `/docs/initiatives/active/` before starting work.
3. **Test Everything**: All code needs tests (`npm test -- --run` must pass).
4. **Build Successfully**: `npm run build` must complete without errors.

## Documentation Map

| Path | Purpose | Read Before |
|------|---------|-------------|
| `/docs/gdd/` | Game design (what to build) | Implementing features |
| `/docs/technical_analysis/` | Technical research (how to build) | Architecture decisions |
| `/docs/initiatives/active/` | Current work plans | Starting any work |
| `/docs/adr/` | Decision records (why) | Understanding choices |

**ADR Creation**: For significant decisions (new libraries, core structures, ECS changes) → `/docs/adr/NNNN-name.md`

## Tech Stack

**Stack**: Phaser 3.87 + Vite 6 + TypeScript 5.6 + Vitest 2.1 ([Rationale](./docs/adr/0001-use-phaser-vite-vitest-stack.md))

**Architecture**: ECS (Entity-Component-System) ([Rationale](./docs/adr/0004-use-ecs-architecture.md))

- **Entities**: `src/ecs/Entity.ts` (train, enemy, scrap, projectile)
- **Components**: `src/components/*.ts` (data-only interfaces)
- **Systems**: `src/systems/*.ts` (logic processors)
- **State**: `src/state/*.ts` (game progression, persistence)
- **Scenes**: `src/scenes/*.ts` (Phaser scenes: Boot, Game, Upgrade)

## Workflow

**Start**: `git pull` → Read `/docs/initiatives/active/*` → Code
**During**: `npm run dev` (dev server) + `npm test` (watch mode)
**Before Commit**: `npm test -- --run && npm run build` must pass + update initiative checkboxes
**PR**: Include initiative link, testing performed, screenshots (for visual changes)

## Code Standards

**TypeScript**: Strict mode, explicit types, no `any`, ES modules
**Naming**: PascalCase (classes/interfaces), camelCase (functions), UPPER_SNAKE_CASE (constants)
**Structure**: One class/file, interfaces separate, tests in `__tests__/`
**Comments**: TSDoc for public APIs, inline for complex logic

## Testing

**Required**: All systems, utilities, game logic
**Format**: `FileName.test.ts` in `__tests__/`
**Target**: >80% systems coverage, >70% overall
**Mock Phaser**: `vi.mock('phaser', () => ({ default: { Math: { Between: ... } } }))`

## Quick Reference

```bash
# Development
npm run dev                              # Dev server (localhost:5173)
npm test                                 # Tests (watch)
npm test -- --run && npm run build       # Pre-commit validation

# Linting
npx markdownlint-cli2 --fix "docs/**/*.md"  # Fix markdown
```

| Need | Check |
|------|-------|
| Feature design | `/docs/gdd/*.md` |
| Current tasks | `/docs/initiatives/active/*.md` |
| Past decisions | `/docs/adr/*.md` |
| Main game loop | `/src/scenes/GameScene.ts` |
| Systems | `/src/systems/*.ts` |
| State/persistence | `/src/state/*.ts` |

**Commits**: Use conventional format: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
