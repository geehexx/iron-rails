# Project Structure

## Directory Organization

```
iron-rails/
├── src/                    # Source code
│   ├── components/         # ECS component definitions (data-only)
│   ├── ecs/               # Entity-Component-System core
│   ├── scenes/            # Phaser game scenes
│   ├── state/             # Game state management & persistence
│   ├── systems/           # Game logic processors
│   ├── __tests__/         # Unit tests
│   └── main.ts            # Application entry point
├── docs/                  # Documentation
│   ├── adr/              # Architecture Decision Records
│   ├── gdd/              # Game Design Documents
│   ├── initiatives/      # Project initiatives tracking
│   └── technical_analysis/ # Technical documentation
├── .github/workflows/     # CI/CD configuration
└── [config files]         # Build and tooling configuration
```

## Core Components

### ECS Architecture (Entity-Component-System)

**Components** (`src/components/`)
- Data-only interfaces with no logic
- `Combat.ts`: Combat-related data (damage, fire rate, range)
- `Health.ts`: Health and armor data
- `Scrap.ts`: Economy/resource data
- `Transform.ts`: Position data
- `Velocity.ts`: Movement data

**ECS Core** (`src/ecs/`)
- `Entity.ts`: Entity management and component attachment
- `World.ts`: Entity container and query system

**Systems** (`src/systems/`)
- Pure logic processors operating on components
- `CombatSystem.ts`: Combat logic and damage calculation
- `MovementSystem.ts`: Physics and movement
- `PlayerSystem.ts`: Player-specific logic
- `ScrapSystem.ts`: Economy and resource collection
- `SpawnerSystem.ts`: Enemy spawning logic
- `SpatialGrid.ts`: Spatial partitioning for efficient targeting
- `UISystem.ts`: UI updates and rendering

### Game Scenes (Phaser)

**Scenes** (`src/scenes/`)
- `BootScene.ts`: Initial loading and setup
- `GameScene.ts`: Main gameplay scene
- `UpgradeScene.ts`: Upgrade station interface

### State Management

**State** (`src/state/`)
- `GameState.ts`: Persistent game state with localStorage
- `UpgradeDefinitions.ts`: Upgrade configurations and metadata

## Architectural Patterns

### Entity-Component-System (ECS)
- Separation of data (components) from logic (systems)
- Composition over inheritance
- Query-based entity processing
- Documented in ADR-0004

### Spatial Partitioning
- Grid-based spatial indexing for efficient collision detection
- Optimizes targeting and proximity queries
- Documented in ADR-0003

### State Persistence
- Centralized game state management
- localStorage for persistent upgrades and progress
- Immutable state updates

### Scene Management
- Phaser scene system for game flow
- Scene transitions between gameplay and upgrades
- Separation of concerns per scene

## Component Relationships

```
GameScene
├── World (ECS)
│   ├── Entities (Player, Enemies)
│   └── Components (Health, Combat, Transform, etc.)
├── Systems
│   ├── PlayerSystem → MovementSystem
│   ├── SpawnerSystem → CombatSystem
│   ├── CombatSystem → SpatialGrid
│   └── ScrapSystem → GameState
└── UISystem → GameState
```

## Testing Structure

- Unit tests in `src/__tests__/`
- Test coverage for systems and state management
- Vitest framework with jsdom for DOM testing
