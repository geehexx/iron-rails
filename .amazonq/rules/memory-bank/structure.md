# Iron Rails - Project Structure

## Directory Organization

### Core Source Code (`src/`)
- **`components/`** - Data-only component interfaces for ECS architecture
  - Combat.ts, Health.ts, Scrap.ts, Transform.ts, Velocity.ts
- **`ecs/`** - Entity-Component-System core framework
  - Entity.ts, World.ts - Core ECS implementation
- **`scenes/`** - Phaser game scenes for different game states
  - BootScene.ts, GameScene.ts, UpgradeScene.ts
- **`state/`** - Game state management and data persistence
  - GameState.ts, UpgradeDefinitions.ts
- **`systems/`** - Game logic processors that operate on components
  - CombatSystem.ts, MovementSystem.ts, PlayerSystem.ts, ScrapSystem.ts, SpatialGrid.ts, SpawnerSystem.ts, UISystem.ts
- **`__tests__/`** - Unit tests for core systems and components

### Documentation (`docs/`)
- **`adr/`** - Architectural Decision Records
- **`gdd/`** - Game Design Documents
- **`initiatives/`** - Project planning and feature tracking
- **`technical_analysis/`** - Technical implementation analysis

### Configuration Files
- **`package.json`** - Node.js dependencies and scripts
- **`tsconfig.json`** - TypeScript compiler configuration
- **`vite.config.ts`** - Vite build tool configuration
- **`vitest.config.ts`** - Testing framework configuration

## Core Components & Relationships

### ECS Architecture Pattern
- **Entities**: Game objects (train, enemies, projectiles)
- **Components**: Data containers (Health, Transform, Combat)
- **Systems**: Logic processors that operate on entities with specific components

### Scene Management
- **BootScene**: Initial loading and setup
- **GameScene**: Main gameplay loop and rendering
- **UpgradeScene**: Between-run upgrade interface

### State Management
- **GameState**: Centralized game state with persistence
- **UpgradeDefinitions**: Configuration for upgrade system

### System Interactions
- **SpatialGrid**: Efficient collision detection and targeting
- **CombatSystem**: Handles damage, projectiles, and combat logic
- **MovementSystem**: Physics and position updates
- **SpawnerSystem**: Enemy generation and wave management
- **ScrapSystem**: Resource collection and economy
- **UISystem**: Interface updates and user feedback

## Architectural Patterns

### Entity-Component-System (ECS)
Separates data (components) from logic (systems) for flexible, maintainable game architecture.

### Scene-Based State Management
Uses Phaser's scene system for clear separation of game states and UI contexts.

### Spatial Partitioning
Implements grid-based spatial partitioning for efficient collision detection and enemy targeting.

### Persistent State
Game state and upgrades persist across sessions using browser storage.