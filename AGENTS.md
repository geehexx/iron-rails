# Agent Instructions for the Iron Rails Project

Welcome, agent. This comprehensive guide provides all guidelines for working on the Iron Rails
codebase. Your goal is to follow these instructions to ensure consistency, quality, and efficient
collaboration.

## Table of Contents

1. [Guiding Principles](#guiding-principles)
2. [Documentation Structure](#documentation-structure)
3. [Project Architecture](#project-architecture)
4. [Development Workflow](#development-workflow)
5. [Code Standards](#code-standards)
6. [Testing Requirements](#testing-requirements)
7. [Initiative Lifecycle](#initiative-lifecycle)
8. [Quick Reference](#quick-reference)

---

## Guiding Principles

### 1. Documentation First

The `/docs` directory is the **single source of truth** for this project. Before starting any
implementation task:

1. Read the relevant **Game Design Document (GDD)** in `/docs/gdd/`
2. Review **Technical Analysis** in `/docs/technical_analysis/`
3. Find and follow the **Active Initiative** in `/docs/initiatives/active/`

**Never** implement features that are not documented in an active initiative.

### 2. Follow the Plan

All significant work is defined in an **Initiative** located in `/docs/initiatives/active/`:

- Find the relevant initiative before starting work
- Follow the tasks outlined within it sequentially
- Update task checkboxes as you complete them
- Do **not** work on tasks not described in an active initiative

### 3. Record Key Decisions

For any significant technical decision, create an **Architectural Decision Record (ADR)**:

- Use template: `/docs/adr/template.md`
- Place in: `/docs/adr/`
- Number sequentially: `0001-decision-name.md`

**Significant decisions** include:

- Choosing a new library or framework
- Defining core data structures
- Establishing performance optimization patterns
- Changing build tools or deployment strategies
- Modifying the ECS architecture

### 4. Test Everything

All code changes must include appropriate tests:

- Unit tests for systems and utilities
- Integration tests for complex interactions
- Manual browser testing for UI/UX changes
- All tests must pass before creating a PR

---

## Documentation Structure

### Core Documentation Directories

| Directory | Purpose | When to Read | When to Write |
|-----------|---------|--------------|---------------|
| `/docs/gdd/` | Game Design - **what** we're building | Before implementing any feature | When planning new features |
| `/docs/technical_analysis/` | Technical research - **how** to build it | Before major technical decisions | After research spikes |
| `/docs/initiatives/` | Development roadmap - **the plan** | At start of every work session | When planning work phases |
| `/docs/adr/` | Decision records - **why** we chose it | When understanding past decisions | After significant technical decisions |

### Initiative States

- **`/docs/initiatives/active/`** - Currently in progress
- **`/docs/initiatives/archive/`** - Completed or superseded

### Documentation Standards

All markdown files must:

- Pass `markdownlint-cli2` validation
- Use proper heading hierarchy
- Include cross-references to related docs
- Have clear, actionable content

---

## Project Architecture

### Technology Stack

- **Framework:** Phaser 3.87.0
- **Build Tool:** Vite 6.0.1
- **Language:** TypeScript 5.6.3
- **Testing:** Vitest 2.1.8
- **Linting:** markdownlint-cli2 0.18.1

See [ADR-0001](./docs/adr/0001-use-phaser-vite-vitest-stack.md) for rationale.

### Code Organization

```text
src/
├── main.ts                    # Phaser game initialization
├── scenes/                    # Phaser scene classes
│   ├── BootScene.ts          # Asset loading
│   └── GameScene.ts          # Main game loop
├── ecs/                      # Entity-Component-System
│   ├── Entity.ts             # Entity type definitions
│   └── World.ts              # Entity lifecycle management
├── components/               # Data-only component interfaces
│   ├── Transform.ts
│   ├── Health.ts
│   ├── Combat.ts
│   └── Velocity.ts
├── systems/                  # Game logic processors
│   ├── SpatialGrid.ts       # Proximity queries
│   ├── SpawnerSystem.ts     # Entity spawning
│   ├── MovementSystem.ts    # Position updates
│   └── CombatSystem.ts      # Combat logic
└── __tests__/               # Unit tests
    ├── SpatialGrid.test.ts
    ├── SpawnerSystem.test.ts
    └── CombatSystem.test.ts
```

### ECS Pattern

**Entities** - Compositional game objects (train, enemy, projectile)

- Defined in `src/ecs/Entity.ts`
- Managed by `World` class
- Have unique IDs and type tags

**Components** - Data-only interfaces (no logic)

- Located in `src/components/`
- Pure TypeScript interfaces
- Attached to entities as needed

**Systems** - Logic processors (pure functions preferred)

- Located in `src/systems/`
- Operate on entities with specific component combinations
- Called from `GameScene.update()` in sequence

See [ADR-0004](./docs/adr/0004-use-ecs-architecture.md) for rationale.

---

## Development Workflow

### Starting Work

1. **Pull latest changes:**

   ```bash
   git pull origin main
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Identify active initiative:**

   ```bash
   ls docs/initiatives/active/
   ```

4. **Read the initiative thoroughly** before coding

### During Development

1. **Run dev server:**

   ```bash
   npm run dev
   # Opens at http://localhost:5173
   ```

2. **Run tests in watch mode:**

   ```bash
   npm test
   ```

3. **Check code compiles:**

   ```bash
   npm run build
   ```

4. **Lint markdown:**

   ```bash
   npx markdownlint-cli2 "docs/**/*.md"
   ```

### Before Committing

1. **Ensure all tests pass:**

   ```bash
   npm test -- --run
   ```

2. **Verify build succeeds:**

   ```bash
   npm run build
   ```

3. **Fix markdown lint errors:**

   ```bash
   npx markdownlint-cli2 --fix "docs/**/*.md"
   ```

4. **Update initiative checkboxes** to reflect completed tasks

### Creating a Pull Request

1. **Write comprehensive PR description:**
   - Summary of changes
   - Link to relevant initiative
   - Screenshots/videos of visual changes
   - Testing performed
   - Breaking changes (if any)

2. **Include verification steps:**
   - Commands to test locally
   - Expected outcomes
   - Known limitations

3. **Reference documentation:**
   - Link to initiative
   - Link to relevant ADRs
   - Link to related GDD sections

---

## Code Standards

### TypeScript

- **Strict mode enabled** - No implicit any
- **ES Modules** - Use import/export
- **Type everything** - Explicit return types for functions
- **No unused variables** - Clean up imports

### Naming Conventions

- **Classes:** PascalCase (e.g., `SpatialGrid`, `CombatSystem`)
- **Interfaces:** PascalCase (e.g., `Transform`, `Health`)
- **Functions/Methods:** camelCase (e.g., `update`, `queryRadius`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_SPEED`, `EXPLOSION_RADIUS`)
- **Files:** Match class/interface name (e.g., `SpatialGrid.ts`)

### File Structure Guidelines

- **One class per file** (exceptions: small utility functions)
- **Interfaces in separate files** from implementations
- **Tests colocated** with source in `__tests__/` directory
- **Imports grouped:** External libraries → Internal modules → Types

### Comments

- **Document why, not what** - Code should be self-explanatory
- **Use TSDoc** for public APIs:

  ```typescript
  /**
   * Queries entities within a circular radius.
   * @param x - Center X coordinate
   * @param y - Center Y coordinate
   * @param radius - Search radius in pixels
   * @returns Array of entity IDs within radius
   */
  queryRadius(x: number, y: number, radius: number): number[]
  ```

- **Inline comments** for complex algorithms

---

## Testing Requirements

### Unit Tests

**Required for:**

- All systems (e.g., `SpatialGrid`, `CombatSystem`)
- Utility functions
- Game logic calculations

**Test file naming:** `FileName.test.ts`

**Framework:** Vitest with jsdom

**Coverage expectations:**

- Critical paths: 100%
- Systems: >80%
- Overall: >70%

### Writing Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { SystemUnderTest } from '../systems/SystemUnderTest';

describe('SystemUnderTest', () => {
  let system: SystemUnderTest;

  beforeEach(() => {
    system = new SystemUnderTest();
  });

  it('should perform expected behavior', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = system.process(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Mocking Phaser

Phaser requires canvas, which doesn't exist in tests. Mock it:

```typescript
vi.mock('phaser', () => ({
  default: {
    Math: {
      Between: (min: number, max: number) => 
        Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
}));
```

### Browser Testing

Use Playwright MCP for visual validation:

1. Start dev server: `npm run dev`
2. Use `mcp5_puppeteer_navigate` to load game
3. Use `mcp5_puppeteer_screenshot` to capture state
4. Use `mcp5_puppeteer_evaluate` to check game state

---

## Initiative Lifecycle

### 1. Planning Phase

1. **Create GDD section** if feature is new
2. **Conduct technical research** if architecture unclear
3. **Write initiative** using template in `/docs/initiatives/template.md`
4. **Place in `/docs/initiatives/active/`**

### 2. Implementation Phase

1. **Read initiative thoroughly**
2. **Work through phases sequentially**
3. **Check off tasks as completed**
4. **Update risks/mitigation if issues arise**
5. **Document decisions in ADRs**

### 3. Completion Phase

1. **Mark all success criteria as complete**
2. **Update status to "Complete"**
3. **Add completion summary with:**
   - Date completed
   - Key achievements
   - Testing results
   - Next steps
4. **Keep in `/docs/initiatives/active/`** (don't archive immediately)

### 4. Archival

Archive initiatives only when:

- Superseded by a newer initiative
- Merged into a larger initiative
- No longer relevant to active development

Move to `/docs/initiatives/archive/` with note explaining reason.

---

## Quick Reference

### Common Commands

```bash
# Development
npm install                   # Install dependencies
npm run dev                   # Start dev server
npm test                      # Run tests (watch mode)
npm run build                 # Production build

# Testing
npm test -- --run            # Run tests once
npm test -- --coverage       # Generate coverage
npx vitest src/__tests__/File.test.ts  # Run specific test

# Linting
npx markdownlint-cli2 "docs/**/*.md"        # Check markdown
npx markdownlint-cli2 --fix "docs/**/*.md"  # Fix markdown

# Git
git status                   # Check changes
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git push origin branch-name  # Push to remote
```

### File Locations Cheat Sheet

| What | Where |
|------|-------|
| Game features | `/docs/gdd/*.md` |
| Technical research | `/docs/technical_analysis/*.md` |
| Current work plan | `/docs/initiatives/active/*.md` |
| Past decisions | `/docs/adr/*.md` |
| Main game code | `/src/scenes/GameScene.ts` |
| ECS systems | `/src/systems/*.ts` |
| Component interfaces | `/src/components/*.ts` |
| Unit tests | `/src/__tests__/*.test.ts` |

### When to Create What

| Situation | Create | Location |
|-----------|--------|----------|
| New feature planned | GDD section | `/docs/gdd/` |
| Technical decision needed | Technical Analysis | `/docs/technical_analysis/` |
| Starting work | Initiative | `/docs/initiatives/active/` |
| Significant tech choice | ADR | `/docs/adr/` |
| New game system | System class + test | `/src/systems/` + `__tests__/` |
| New data type | Component interface | `/src/components/` |

### Git Workflow

1. **Create branch:** `git checkout -b feature/description`
2. **Make changes** following initiative
3. **Test thoroughly:** `npm test -- --run && npm run build`
4. **Commit:** `git commit -m "feat: description"`
5. **Push:** `git push origin feature/description`
6. **Create PR** with comprehensive description

---

## Getting Help

If uncertain about any aspect:

1. **Check existing documentation** in `/docs/`
2. **Review similar code** in the codebase
3. **Look at past ADRs** for decision context
4. **Check initiative** for specific guidance
5. **When in doubt, ask** - don't make assumptions

---

## Code Formatting and Linting

This project uses `markdownlint-cli2` to enforce consistent style across all Markdown files.
The linter is configured to run automatically as a pre-commit hook via husky.

**Key markdown rules:**

- Lines should not exceed 300 characters
- Fenced code blocks must specify a language
- Lists must be surrounded by blank lines
- No trailing whitespace

**Auto-fix:** `npx markdownlint-cli2 --fix "docs/**/*.md"`

---

Your adherence to this structured approach is critical for the success of the project.
