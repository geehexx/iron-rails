# Development Guidelines

## Code Quality Standards

### TypeScript Strict Mode
- **Strict type checking enabled**: All code must pass TypeScript strict mode
- **No unchecked indexed access**: Array/object access must be validated
- **Explicit return types**: Public methods should declare return types
- **Non-null assertions avoided**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### Naming Conventions
- **Classes**: PascalCase (e.g., `GameScene`, `CombatSystem`, `SpatialGrid`)
- **Interfaces**: PascalCase (e.g., `PlayerUpgrades`, `GameStateData`, `UpgradeConfig`)
- **Variables/Functions**: camelCase (e.g., `gameState`, `enemiesKilled`, `calculateUpgradeCost`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_STATE`, `STORAGE_KEY`, `EXPLOSION_RADIUS`)
- **Private fields**: Prefix with `private` keyword, use camelCase (e.g., `private world`, `private armorMultiplier`)

### File Organization
- **One class per file**: Each class/system in its own file
- **Imports at top**: All imports grouped at file start
- **Export pattern**: Single default or named export per file
- **File naming**: Match class name (e.g., `GameScene.ts`, `CombatSystem.ts`)

## Architectural Patterns

### Entity-Component-System (ECS)

**Component Pattern** (5/5 files follow):
```typescript
// Components are pure data interfaces with no methods
export interface Health {
  current: number;
  max: number;
}

export interface Combat {
  damage: number;
  range: number;
  fireRate: number;
  lastFired: number;
}
```

**System Pattern** (5/5 files follow):
```typescript
// Systems contain logic and operate on entities with specific components
export class CombatSystem {
  update(world: World, time: number, delta: number, spatialGrid: SpatialGrid): void {
    const train = world.getEntitiesByType('train')[0];
    if (!train?.combat || !train.transform) return;
    // System logic here
  }
}
```

**Entity Access Pattern** (5/5 files follow):
```typescript
// Always validate component existence before use
const train = world.getEntitiesByType('train')[0];
if (!train?.transform || !train.health) return;
```

### State Management

**Immutable Updates** (4/5 files follow):
```typescript
// Return copies, never mutate directly
getUpgrades(): PlayerUpgrades {
  return { ...this.data.upgrades };
}

// Spread operator for object cloning
this.data = {
  ...DEFAULT_STATE,
  upgrades: { ...DEFAULT_STATE.upgrades }
};
```

**Persistence Pattern** (3/5 files follow):
```typescript
// Save after state mutations
addScrap(amount: number): void {
  this.data.scrap += amount;
  this.save();
}

// Versioned save format with checksum
const saveData = {
  version: SAVE_VERSION,
  timestamp: Date.now(),
  data: this.data,
  checksum: this.checksum(dataString)
};
```

### Phaser Scene Lifecycle

**Initialization Pattern** (5/5 files follow):
```typescript
constructor() { super('GameScene'); }

init(data?: { gameState?: GameState }) {
  // Initialize scene-specific state
  this.gameState = data?.gameState || new GameState();
  this.isPaused = false;
}

create() {
  // Create game objects and systems
  this.world = new World();
  this.combat = new CombatSystem();
}

update(time: number, delta: number): void {
  // Game loop logic
  if (this.gameOver) return;
  if (this.isPaused) return;
}
```

## Common Implementation Patterns

### Dependency Injection (4/5 files)
```typescript
// Pass dependencies via constructor
constructor(
  private onEnemyKilled?: (enemyId: EntityId, x: number, y: number) => void
) {}

// Callback pattern for cross-system communication
this.combat = new CombatSystem((enemyId, x, y) => {
  this.enemiesKilled++;
  this.scrapSystem.spawnScrap(x, y, this.world, this, this.spatialGrid);
});
```

### Guard Clauses (5/5 files)
```typescript
// Early returns for invalid states
if (this.gameOver) return;
if (this.isPaused) return;
if (!train?.transform || !train.health) return;
if (time - train.combat.lastFired < train.combat.fireRate) return;
```

### Squared Distance Optimization (3/5 files)
```typescript
// Avoid Math.sqrt by comparing squared distances
const dx = entity.transform.x - x;
const dy = entity.transform.y - y;
const distSq = dx * dx + dy * dy;

if (distSq < minDistSq) {
  minDistSq = distSq;
  nearest = id;
}
```

### Configuration Objects (4/5 files)
```typescript
// Centralized configuration with metadata
export interface UpgradeConfig {
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;
  effectPerLevel: number;
  maxLevel: number;
  statKey: keyof PlayerUpgrades;
  format: (value: number) => string;
}

export const UPGRADES: Record<string, UpgradeConfig> = {
  maxHp: { /* config */ },
  armor: { /* config */ }
};
```

### Clamping and Validation (4/5 files)
```typescript
// Clamp values to valid ranges
this.armorMultiplier = Math.max(0, 1.0 - Math.min(armorValue, 1.0));
train.health.current = Math.max(0, train.health.current - scaledDamage);

// Validate before use
if (armorValue < 0) {
  console.warn(`negative armorValue ${armorValue} clamped to 0`);
  armorValue = 0;
}
```

## Testing Standards

### Test Structure (Vitest)
```typescript
describe('ComponentName', () => {
  let instance: ComponentType;

  beforeEach(() => {
    // Setup fresh state
    localStorage.clear();
    instance = new ComponentType();
  });

  afterEach(() => {
    // Cleanup
    localStorage.clear();
  });

  describe('Feature Group', () => {
    it('should describe expected behavior', () => {
      // Arrange, Act, Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Test Coverage Priorities
- **State management**: All mutations and persistence
- **System logic**: Core game mechanics
- **Edge cases**: Boundary conditions and invalid inputs
- **Integration**: Cross-system interactions

## Documentation Standards

### JSDoc Comments (3/5 files)
```typescript
/**
 * Calculate cost for next level of an upgrade
 */
export function calculateUpgradeCost(
  config: UpgradeConfig,
  currentLevel: number
): number {
  return Math.floor(config.baseCost * Math.pow(config.costGrowth, currentLevel));
}

/**
 * Set armor damage reduction.
 * @param armorValue - Armor value between 0.0 (no reduction) and 1.0 (100% reduction, immune).
 *                     Values > 1.0 are capped at full immunity.
 */
setArmor(armorValue: number): void {
  // Implementation
}
```

### File Headers (2/5 files)
```typescript
/**
 * GameState manager - Handles player progression, currency, and upgrades
 * Persists data to localStorage between sessions
 */
```

### Inline Comments
- Explain "why" not "what"
- Document non-obvious logic
- Clarify complex calculations
- Note important constraints

## Performance Patterns

### Spatial Partitioning (4/5 files)
```typescript
// Use spatial grid for efficient proximity queries
this.spatialGrid.insert(entity.id, x, y);
const candidates = spatialGrid.queryRadius(x, y, range);
```

### Time-based Updates (5/5 files)
```typescript
// Scale by delta time for frame-rate independence
const effectiveDelta = delta * this.gameSpeed;
const deltaSeconds = effectiveDelta / 1000;
this.distance += train.velocity.vx * deltaSeconds;
```

### Object Pooling Consideration
- Cleanup off-screen entities to prevent memory leaks
- Remove from spatial grid when destroying entities

## Error Handling

### Defensive Programming (5/5 files)
```typescript
// Try-catch for I/O operations
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  // Process saved data
} catch (error) {
  console.error('Failed to load game state:', error);
  return DEFAULT_STATE;
}

// Validate external data
if (parsed.version !== SAVE_VERSION) {
  console.warn('Save version mismatch, using defaults');
  return DEFAULT_STATE;
}
```

### Console Logging
- `console.log()`: State changes and important events
- `console.warn()`: Recoverable issues and validation failures
- `console.error()`: Critical failures and exceptions

## Code Style Preferences

### Formatting
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **Line length**: Reasonable (no strict limit observed)
- **Trailing commas**: Not consistently used

### Control Flow
- Prefer early returns over nested conditionals
- Use ternary operators for simple conditionals
- Optional chaining for safe property access

### Type Annotations
- Explicit types for function parameters
- Explicit return types for public methods
- Type inference acceptable for local variables
