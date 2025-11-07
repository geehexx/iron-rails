# Initiative: V2.0 Loadout Expansion Implementation

**Status:** In Progress
**Created:** 2025-11-02
**Updated:** 2025-11-07
**Owner:** Development Team
**Priority:** High
**Estimated Effort:** 3-4 weeks

---

## 1. Objective

To introduce horizontal progression and deeper strategic choice by allowing players to customize their train. This initiative adds new train cars, specialized weapons, and new enemy types to challenge the player's custom builds.

### Strategic Goals

- **Horizontal Progression**: Provide meaningful build diversity beyond stat upgrades
- **Replayability**: Different train configurations create varied gameplay experiences
- **Strategic Depth**: Force players to make meaningful trade-offs (offense vs defense, speed vs durability)
- **Foundation for V3.0**: Establish modular architecture for future specialized modules

---

## 2. Success Criteria

### Functional Requirements

- [ ] Players can purchase and add new train cars (Cargo Car, Gun Car) at the Upgrade Station
- [ ] The train's game logic correctly handles multi-car trains, including the rearmost car taking damage first
- [ ] New specialized weapons (Gatling, Cannon) can be acquired and equipped onto "Hardpoint" slots on Gun Cars
- [ ] New enemy types (Bloater, Runner) are implemented and added to the zombie spawn tables
- [ ] The Upgrade Station UI is updated to support train car and weapon loadout management

### Technical Requirements

- [ ] All new systems have comprehensive unit tests (>80% coverage)
- [ ] Visual regression tests for UI changes
- [ ] Performance benchmarks for multi-car trains (target: 60fps with 5 cars + 100 enemies)
- [ ] Save/load system handles train configurations correctly
- [ ] ECS architecture maintained (components remain data-only, systems remain pure logic)

### Quality Requirements

- [ ] TypeScript strict mode compliance
- [ ] No breaking changes to existing save files (migration strategy implemented)
- [ ] Accessibility: keyboard navigation for loadout management
- [ ] Documentation: ADR for architectural decisions, inline comments for complex logic

---

## 3. Scope

### In Scope

- Implementation of all features as defined in the "Phase 2: Building and Loadout (V2.0)" section of `02_Future_Versions.md`
- Refactoring the `Train` entity to support a collection of `TrainCar` entities
- New components: `TrainCar`, `Weapon`, `Hardpoint`
- New systems: `TrainSystem`, `WeaponSystem` (extracted from CombatSystem)
- UI for managing weapon loadouts (modal-based, not drag-and-drop to reduce complexity)
- Creating the `Bloater` and `Runner` enemy variants with unique behaviors
- Save file migration from V1.5 to V2.0 format
- Visual and headless testing infrastructure

### Out of Scope

- Any features from V3.0 (Specialized Modules, advanced targeting AI, etc.)
- Rearranging the order of train cars (the GDD specifies a fixed order for now)
- Full drag-and-drop UI (deferred to future iteration)
- Multiplayer or co-op features
- Mobile/touch controls

### Deferred to Future Iterations

- Advanced weapon targeting modes ("Target Strongest", "Target Fastest")
- Visual effects for weapon firing (particle systems)
- Sound effects and music
- Train car visual customization (paint jobs, decals)

---

## 4. Architecture Analysis

### Current State Assessment

**Strengths:**
- Clean ECS architecture (ADR-0004) with clear separation of concerns
- Spatial partitioning (ADR-0003) provides efficient targeting foundation
- Immutable state management with localStorage persistence
- Comprehensive test coverage for core systems (6 test files)
- TypeScript strict mode enforced

**Challenges:**
- Current train is a single entity, needs refactoring to multi-entity composition
- CombatSystem tightly couples train combat logic, needs extraction
- No visual testing infrastructure
- Save file format needs versioning strategy for breaking changes
- UI system is monolithic, needs modularization for complex loadout management

### Architectural Decisions Required

#### 1. Train Composition Pattern

**Option A: Entity Hierarchy (Recommended)**
- Train entity contains array of TrainCar entity IDs
- Each TrainCar is a full entity with components (Transform, Health, Combat, etc.)
- Systems iterate over train cars independently
- **Pros**: Leverages existing ECS, flexible, testable
- **Cons**: More complex entity management

**Option B: Component Array**
- Train entity has `trainCars: TrainCar[]` component
- TrainCar is a data structure, not an entity
- **Pros**: Simpler, fewer entities
- **Cons**: Breaks ECS pattern, harder to apply systems uniformly

**Decision**: Option A - maintains ECS purity and provides better extensibility

#### 2. Damage Propagation Strategy

**Approach**: Rear-to-front damage cascade
- CombatSystem targets "train" entity type
- New `TrainSystem` intercepts damage, routes to rearmost car
- When car destroyed, remove from train composition, next car becomes rear
- Game over when engine (first car) destroyed

#### 3. Weapon System Architecture

**Approach**: Extract weapon logic from CombatSystem
- New `Weapon` component: `{ type: 'gatling' | 'cannon', damage, fireRate, range, lastFired }`
- New `Hardpoint` component: `{ weaponId: EntityId | null, position: Vector2 }`
- New `WeaponSystem`: handles firing logic for all weapons
- CombatSystem becomes coordinator, delegates to WeaponSystem

#### 4. Enemy Variant System

**Approach**: Component composition for enemy types
- Base enemy has Health, Transform, Velocity, Combat
- Bloater: Higher health, larger explosion radius (new `Explosion` component)
- Runner: Higher velocity, lower health
- SpawnerSystem uses weighted spawn tables based on game level

---

## 5. Testing Strategy

### Current Testing Infrastructure

- **Framework**: Vitest 2.1.9 with jsdom 27.1.0
- **Coverage**: 6 test files covering core systems
- **Gaps**: No visual testing, no integration tests, no performance benchmarks

### Proposed Testing Enhancements

#### A. Visual Regression Testing

**Tool**: Playwright (recommended for Phaser games)
- Headless browser testing with screenshot comparison
- Test upgrade scene UI layouts
- Test loadout management modal
- Test multi-car train rendering

**Implementation**:
```typescript
// tests/visual/upgrade-scene.spec.ts
import { test, expect } from '@playwright/test';

test('upgrade scene renders correctly', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // Navigate to upgrade scene
  await expect(page).toHaveScreenshot('upgrade-scene.png');
});
```

#### B. Headless Game Testing

**Approach**: Phaser headless mode for game logic testing
- Test multi-car train behavior without rendering
- Test weapon firing patterns
- Test enemy spawning and behavior
- Performance benchmarking

**Implementation**:
```typescript
// tests/integration/train-composition.test.ts
import Phaser from 'phaser';
import { GameScene } from '../../src/scenes/GameScene';

test('multi-car train takes damage rear-to-front', () => {
  const config = {
    type: Phaser.HEADLESS,
    scene: GameScene,
    // ...
  };
  const game = new Phaser.Game(config);
  // Test logic
});
```

#### C. Golden Tests (Snapshot Testing)

**Approach**: Snapshot testing for data structures
- GameState serialization format
- Train configuration objects
- Upgrade definitions

**Note**: Golden tests will require frequent updates during active development. Implement with clear documentation on when to update snapshots.

#### D. Performance Benchmarks

**Metrics to Track**:
- Frame time with 5 train cars + 100 enemies
- Spatial grid query performance
- Save/load time for complex configurations
- Memory usage over 10-minute gameplay session

**Tool**: Vitest benchmark mode
```typescript
import { bench } from 'vitest';

bench('spatial grid query with 100 entities', () => {
  spatialGrid.queryRadius(x, y, range);
});
```

---

## 6. Phases & Tasks

### Phase 0: Testing Infrastructure (Week 1) ✅ COMPLETE

**Goal**: Establish robust testing foundation before major refactoring

- [x] Install and configure Playwright for visual testing
- [x] Set up Phaser headless mode for integration tests
- [x] Configure Vitest coverage reporting (@vitest/coverage-v8)
- [x] Create test utilities for ECS entity creation
- [x] Establish baseline performance benchmarks
- [x] Document testing guidelines in memory bank

**Deliverables**:
- [x] `tests/visual/` directory with Playwright config
- [x] `tests/integration/` directory with headless game tests
- [x] `tests/benchmarks/` directory with performance tests
- [x] Updated `package.json` with test scripts
- [x] ADR documenting testing strategy

**Baseline Performance Results**:
- insert 100 entities: ~0.02ms (48,639 ops/sec) ✅
- queryRadius 100 entities: ~0.03ms (38,017 ops/sec) ✅
- queryRadius 150 entities: ~0.05ms (21,009 ops/sec) ✅
- All targets met (<1ms for spatial operations)

### Phase 1: Component & System Foundation (Week 1-2) ✅ COMPLETE

**Goal**: Create new components and refactor existing systems without breaking current functionality

#### 1.1 New Components ✅

- [x] Create `TrainCar.ts` component interface
- [x] Create `Weapon.ts` component interface
- [x] Create `Hardpoint.ts` component interface
- [x] Create `Explosion.ts` component for Bloater AOE
- [x] Write unit tests for component type definitions

#### 1.2 Train System ✅

- [x] Create `TrainSystem.ts` for managing train composition
  - Train car creation and destruction
  - Damage routing to rearmost car
  - Train car positioning (visual spacing)
  - Health aggregation for UI
- [x] Write comprehensive unit tests for TrainSystem (8 tests, 100% coverage)
  - Test damage propagation
  - Test car destruction cascade
  - Test game over condition (engine destroyed)
- [x] Write integration tests with headless Phaser

#### 1.3 Weapon System ✅

- [x] Extract weapon logic from CombatSystem into new `WeaponSystem.ts`
- [x] Implement weapon type behaviors:
  - Default: Balanced (current behavior)
  - Gatling: High fire rate (400ms), low damage (0.5)
  - Cannon: Low fire rate (2000ms), high damage (5)
- [x] Update CombatSystem to delegate to WeaponSystem
- [x] Write unit tests for each weapon type (6 tests, 100% coverage)
- [x] Write performance benchmarks for weapon firing

**Deliverables**: ✅
- [x] 4 new component files with tests
- [x] 2 new system files with comprehensive tests
- [x] Updated Entity and World with new methods
- [x] Performance benchmarks showing no regression

### Phase 2: Enemy Variants (Week 2) ✅ COMPLETE

**Goal**: Implement Bloater and Runner enemy types with unique behaviors

#### 2.1 Enemy Type System ✅

- [x] Create `EnemyTypes.ts` configuration file
  ```typescript
- [x] Update SpawnerSystem to support enemy type selection
- [x] Implement weighted spawn tables based on game level
  - Level 1-2: 100% Shambler
  - Level 3: 80% Shambler, 15% Runner, 5% Bloater
  - Level 4: 70% Shambler, 20% Runner, 10% Bloater
  - Level 5+: 60% Shambler, 25% Runner, 15% Bloater

#### 2.2 Bloater Implementation ✅

- [x] Create Bloater with high HP (10) and large explosion (radius: 150)
- [x] Update CombatSystem to handle variable explosion radius (deferred to integration)
- [x] Add visual distinction (orange color 0xff6600)
- [x] Write unit tests for Bloater config
- [x] Balance testing: Bloater drops 3 scrap, slower speed

#### 2.3 Runner Implementation ✅

- [x] Create Runner with low HP (1) and high speed (vx: -80)
- [x] Add visual distinction (red color 0xff0000)
- [x] Write unit tests for Runner config
- [x] Balance testing: Runner drops 2 scrap, fast threat

**Deliverables**: ✅
- [x] EnemyConfig system with 3 enemy types
- [x] Weighted spawn tables with selectEnemyType function
- [x] Unit tests for all enemy types (8 tests)
- [x] Balance documentation with tunable constants

### Phase 3: State Management & Persistence (Week 2-3)

**Goal**: Extend GameState to handle train configurations and weapon loadouts

#### 3.1 State Schema Extension

- [ ] Extend `GameStateData` interface:
  ```typescript
  export interface GameStateData {
    // ... existing fields
    trainCars: TrainCarConfig[];
    weapons: WeaponConfig[];
    unlockedCars: ('gun' | 'cargo')[];
    unlockedWeapons: ('gatling' | 'cannon')[];
  }
  ```
- [ ] Implement save file migration from V1.5 to V2.0
  - Detect old format (version check)
  - Migrate to new format with default train (engine only)
  - Preserve existing upgrades and progress
- [ ] Update SAVE_VERSION constant to 2
- [ ] Write migration tests with V1.5 save files

#### 3.2 Train Configuration Management

- [ ] Add methods to GameState:
  - `purchaseTrainCar(type, cost): boolean`
  - `getTrainConfiguration(): TrainCarConfig[]`
  - `equipWeapon(carIndex, weaponType): boolean`
  - `unequipWeapon(carIndex): boolean`
- [ ] Implement validation logic:
  - Max 5 train cars
  - Cargo cars must be at rear
  - Gun cars can only equip one weapon per hardpoint
- [ ] Write comprehensive unit tests for all new methods

#### 3.3 Unlock System

- [ ] Add unlock progression:
  - Gun Car: Unlocked at level 3, costs 50 scrap
  - Cargo Car: Unlocked at level 2, costs 30 scrap
  - Gatling: Unlocked at level 4, costs 40 scrap
  - Cannon: Unlocked at level 5, costs 60 scrap
- [ ] Update UpgradeDefinitions with car/weapon configs
- [ ] Write tests for unlock conditions

**Deliverables**:
- Extended GameState with train configuration support
- Save file migration system with tests
- Unlock progression system
- 100% test coverage for state management

### Phase 4: Game Scene Integration (Week 3)

**Goal**: Integrate new systems into GameScene without breaking existing gameplay

#### 4.1 Train Initialization

- [ ] Update GameScene.create() to build multi-car train from GameState
- [ ] Create train car entities with proper spacing
- [ ] Initialize weapons on gun cars
- [ ] Update spatial grid to track all train cars
- [ ] Write integration tests for train initialization

#### 4.2 System Integration

- [ ] Add TrainSystem to game loop
- [ ] Add WeaponSystem to game loop
- [ ] Update UISystem to display multi-car health
- [ ] Update collision detection for multi-car train
- [ ] Write integration tests for full game loop

#### 4.3 Visual Representation

- [ ] Create distinct sprites for each car type:
  - Engine: Blue rectangle (existing)
  - Gun Car: Green rectangle with turret indicator
  - Cargo Car: Gray rectangle (larger)
- [ ] Implement train car spacing (50px between cars)
- [ ] Add weapon visual indicators on gun cars
- [ ] Write visual regression tests

**Deliverables**:
- Fully integrated multi-car train system
- Visual distinction for all car types
- Integration tests with headless Phaser
- Visual regression tests with Playwright

### Phase 5: UI Implementation (Week 3-4)

**Goal**: Create intuitive UI for managing train configuration and weapon loadouts

#### 5.1 Upgrade Scene Refactor

- [ ] Create tabbed interface:
  - Tab 1: Stat Upgrades (existing)
  - Tab 2: Train Cars
  - Tab 3: Weapons
- [ ] Implement tab navigation with keyboard support
- [ ] Write visual regression tests for each tab

#### 5.2 Train Cars Tab

- [ ] Display current train configuration (visual representation)
- [ ] Show available car types with unlock status
- [ ] Implement purchase buttons with cost display
- [ ] Show car stats (HP bonus, hardpoint count)
- [ ] Add "Remove Car" functionality (refund 50% scrap)
- [ ] Write interaction tests with Playwright

#### 5.3 Weapons Tab

- [ ] Display all gun cars with hardpoint slots
- [ ] Show available weapons with unlock status
- [ ] Implement equip/unequip functionality
- [ ] Show weapon stats comparison
- [ ] Add weapon purchase system (weapons are inventory items)
- [ ] Write interaction tests with Playwright

#### 5.4 Accessibility & Polish

- [ ] Keyboard navigation for all UI elements
- [ ] Screen reader support (ARIA labels)
- [ ] Hover tooltips with detailed information
- [ ] Confirmation dialogs for destructive actions
- [ ] Visual feedback for invalid actions

**Deliverables**:
- Fully functional tabbed upgrade interface
- Train car management UI
- Weapon loadout management UI
- Accessibility compliance
- Comprehensive visual and interaction tests

### Phase 6: Testing, Balancing & Documentation (Week 4)

**Goal**: Ensure quality, balance, and maintainability

#### 6.1 Comprehensive Testing

- [ ] Achieve >80% code coverage for all new code
- [ ] Run full visual regression test suite
- [ ] Performance testing with max configuration (5 cars, 100 enemies)
- [ ] Save/load testing with various configurations
- [ ] Edge case testing (empty train, max train, etc.)

#### 6.2 Balance Tuning

- [ ] Playtest with different train configurations
- [ ] Tune enemy spawn rates and difficulty curve
- [ ] Adjust weapon damage and fire rates
- [ ] Balance car costs and unlock progression
- [ ] Document balance decisions and tunable constants

#### 6.3 Documentation

- [ ] Write ADR for train composition architecture
- [ ] Write ADR for weapon system design
- [ ] Write ADR for testing strategy
- [ ] Update memory bank with new patterns
- [ ] Create developer guide for adding new car types
- [ ] Create developer guide for adding new weapon types
- [ ] Update README with V2.0 features

#### 6.4 Code Quality

- [ ] Code review for all new systems
- [ ] Refactor any code smells or technical debt
- [ ] Ensure TypeScript strict mode compliance
- [ ] Run linter and fix all warnings
- [ ] Optimize performance bottlenecks

**Deliverables**:
- >80% test coverage
- Balanced gameplay with documented constants
- Comprehensive documentation (ADRs, guides)
- Production-ready code quality

---

## 7. Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| Refactoring train logic introduces bugs | High | Critical | Comprehensive unit and integration tests before refactoring; feature flags for gradual rollout; maintain V1.5 branch for rollback |
| Performance degradation with multi-car trains | Medium | High | Early performance benchmarking; optimize spatial grid for multiple train entities; profile and optimize hot paths |
| Save file migration breaks existing saves | Medium | Critical | Extensive migration testing; backup save files; provide manual reset option; version detection with fallback to defaults |
| UI complexity overwhelms players | Medium | Medium | User testing with prototype; iterative design; tooltips and tutorials; start with simple default configuration |
| New enemies are unbalanced | High | Medium | Expose all stats as tunable constants; extensive playtesting; gather metrics on win rates; iterate quickly on balance |
| Testing infrastructure delays development | Low | Medium | Parallel development: testing setup in Phase 0 while design work continues; use existing Vitest for unit tests initially |
| Scope creep from V3.0 features | Medium | Medium | Strict scope enforcement; document deferred features; regular scope reviews; timebox each phase |
| ECS architecture doesn't scale to complex train | Low | High | Validate architecture with prototype in Phase 1; consult ECS best practices; consider full ECS library if needed |

---

## 8. Dependencies & Prerequisites

### Technical Dependencies

- Phaser 3.87.0 (existing)
- Vitest 2.1.9 (existing)
- **New**: Playwright ^1.40.0 (for visual testing)
- **New**: @vitest/coverage-v8 ^2.1.9 (for coverage reporting)
- **New**: @vitest/ui ^2.1.9 (for test UI, optional)

### Knowledge Prerequisites

- Understanding of ECS architecture (ADR-0004)
- Familiarity with Phaser scene lifecycle
- Experience with Vitest testing framework
- Understanding of spatial partitioning (ADR-0003)

### Blockers

- None identified (V1.5 is complete and stable)

---

## 9. Success Metrics

### Quantitative Metrics

- **Test Coverage**: >80% for all new code
- **Performance**: Maintain 60fps with 5 cars + 100 enemies
- **Save File Migration**: 100% success rate in testing
- **Build Time**: <5 seconds for development builds
- **Bundle Size**: <2MB increase from V1.5

### Qualitative Metrics

- **Code Quality**: All code passes TypeScript strict mode
- **Maintainability**: New developers can add car types in <1 hour
- **Player Experience**: Loadout management is intuitive (user testing)
- **Balance**: Multiple viable build strategies exist

### Acceptance Criteria

- All success criteria checkboxes completed
- All tests passing (unit, integration, visual)
- Performance benchmarks met
- Documentation complete and reviewed
- Code review approved by team
- Playtest feedback incorporated

---

## 10. Related Documentation

- **Game Design:** [02-future-versions.md](../../gdd/02-future-versions.md)
- **Architecture:** [ADR-0004: ECS Architecture](../../adr/0004-use-ecs-architecture.md)
- **Architecture:** [ADR-0003: Spatial Partitioning](../../adr/0003-use-spatial-partitioning-for-targeting.md)
- **Testing:** [Testing Guidelines](../../memory-bank/testing-guidelines.md) (to be created)
- **Development:** [Adding New Car Types Guide](../../guides/adding-car-types.md) (to be created)
- **Development:** [Adding New Weapon Types Guide](../../guides/adding-weapon-types.md) (to be created)

---

## 11. Implementation Details

### Train Composition System

**Entity Structure**:
```typescript
// Train entity acts as composition root
interface TrainComposition {
  carIds: EntityId[];  // Ordered array: [engine, car1, car2, ...]
  spacing: number;     // Distance between cars (50px)
}

// Each car is an independent entity
interface TrainCarEntity extends Entity {
  type: 'train-car';
  trainCar: TrainCar;     // Car type and position
  transform: Transform;    // World position
  health: Health;          // Individual car health
  velocity: Velocity;      // Inherited from train
  sprite: Phaser.GameObject;
  hardpoints?: Hardpoint[]; // Gun cars only
}
```

**Damage Propagation Logic**:
1. CombatSystem detects damage to any train-car entity
2. TrainSystem intercepts via event/callback
3. TrainSystem routes damage to rearmost car (highest index in carIds)
4. If car destroyed, remove from composition and destroy entity
5. Game over when carIds[0] (engine) is destroyed

**Visual Positioning**:
- Engine at base position (200, 360)
- Each subsequent car offset by -spacing on x-axis
- All cars share same y-coordinate (train moves as unit)
- Update all car transforms when train moves

### Weapon System Architecture

**Weapon Entity Structure**:
```typescript
interface WeaponEntity extends Entity {
  type: 'weapon';
  weapon: Weapon;          // Type, stats, fire state
  transform: Transform;    // Relative to parent car
  combat: Combat;          // Damage, range, fire rate
}
```

**Hardpoint System**:
- Gun cars have 1 hardpoint (center-top of car)
- Hardpoint stores weaponId (null if empty)
- Weapon transform is relative to car transform
- WeaponSystem updates weapon world position each frame

**Firing Logic**:
1. WeaponSystem iterates all weapon entities
2. Calculate world position from car transform + weapon offset
3. Use SpatialGrid to find targets in range
4. Apply weapon-specific behavior (fire rate, damage)
5. Update weapon.lastFired timestamp

**Weapon Types**:
- **Default**: 1 damage, 800ms fire rate, 400 range (balanced)
- **Gatling**: 0.5 damage, 400ms fire rate, 350 range (anti-swarm)
- **Cannon**: 5 damage, 2000ms fire rate, 450 range (anti-tank)

### Enemy Variant System

**Spawn Weight Tables**:
```typescript
const SPAWN_TABLES: Record<number, EnemySpawnWeight[]> = {
  1: [{ type: 'shambler', weight: 100 }],
  2: [{ type: 'shambler', weight: 100 }],
  3: [{ type: 'shambler', weight: 80 }, { type: 'runner', weight: 15 }, { type: 'bloater', weight: 5 }],
  4: [{ type: 'shambler', weight: 70 }, { type: 'runner', weight: 20 }, { type: 'bloater', weight: 10 }],
  5: [{ type: 'shambler', weight: 60 }, { type: 'runner', weight: 25 }, { type: 'bloater', weight: 15 }],
};
```

**Enemy Configurations**:
```typescript
export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  shambler: {
    health: 3,
    speed: -30,
    explosionRadius: 80,
    explosionDamage: 1,
    scrapDrop: 1,
    color: 0x00ff00  // Green
  },
  bloater: {
    health: 10,
    speed: -20,
    explosionRadius: 150,
    explosionDamage: 2,
    scrapDrop: 3,
    color: 0xff6600  // Orange
  },
  runner: {
    health: 1,
    speed: -80,
    explosionRadius: 60,
    explosionDamage: 1,
    scrapDrop: 2,
    color: 0xff0000  // Red
  }
};
```

### State Management Schema

**Extended GameStateData**:
```typescript
export interface GameStateData {
  // V1.5 fields (unchanged)
  scrap: number;
  upgrades: PlayerUpgrades;
  currentLevel: number;
  totalEnemiesKilled: number;
  totalDistanceTraveled: number;
  
  // V2.0 additions
  trainCars: TrainCarConfig[];  // Ordered array of car configs
  weaponInventory: WeaponType[];  // Owned weapons
  unlockedCars: CarType[];  // Available for purchase
  unlockedWeapons: WeaponType[];  // Available for purchase
}

interface TrainCarConfig {
  carType: CarType;
  equippedWeapon?: WeaponType;  // Gun cars only
}
```

**Save File Migration**:
```typescript
function migrateV1toV2(oldData: V1GameStateData): GameStateData {
  return {
    ...oldData,
    trainCars: [{ carType: 'engine' }],  // Start with engine only
    weaponInventory: ['default'],  // Default weapon included
    unlockedCars: [],  // Nothing unlocked yet
    unlockedWeapons: []  // Nothing unlocked yet
  };
}
```

### Unlock Progression

**Unlock Conditions**:
```typescript
export const UNLOCK_PROGRESSION = {
  cars: {
    cargo: { level: 2, cost: 30, description: 'Adds +20 HP buffer' },
    gun: { level: 3, cost: 50, description: 'Adds weapon hardpoint' }
  },
  weapons: {
    gatling: { level: 4, cost: 40, description: 'High fire rate, low damage' },
    cannon: { level: 5, cost: 60, description: 'High damage, slow fire rate' }
  }
};
```

**Car Stats**:
```typescript
export const CAR_STATS = {
  engine: { health: 10, hardpoints: 1 },  // Base train
  gun: { health: 8, hardpoints: 1 },      // Offensive
  cargo: { health: 20, hardpoints: 0 }    // Defensive
};
```

### UI Layout Specifications

**Tabbed Interface Structure**:
```
┌─────────────────────────────────────────────────┐
│  === UPGRADE STATION ===                        │
│  Scrap: 150 | Level 5 | Next: 15.0 km          │
├─────────────────────────────────────────────────┤
│  [Stats] [Train Cars] [Weapons]                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab Content Area                               │
│  (Stats upgrades / Car management / Weapons)    │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│         [Continue to Next Run]                  │
└─────────────────────────────────────────────────┘
```

**Train Cars Tab Layout**:
```
Current Train: [Engine] [Gun Car] [Cargo Car]
                  10HP      8HP       20HP
                           [Gatling]

Available Cars:
┌─────────────────────────────────────┐
│ Gun Car          [50 Scrap]         │
│ +8 HP, +1 Hardpoint                 │
│ Unlocked at Level 3                 │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Cargo Car        [30 Scrap]         │
│ +20 HP, No weapons                  │
│ Unlocked at Level 2                 │
└─────────────────────────────────────┘

[Remove Last Car] (70% refund)
```

**Weapons Tab Layout**:
```
Inventory: [Default] [Gatling] [Cannon]

Equipped Weapons:
  Gun Car 1: [Gatling] [Unequip]
  Gun Car 2: [Empty]   [Equip...]

Available Weapons:
┌─────────────────────────────────────┐
│ Gatling          [40 Scrap]         │
│ Damage: 0.5 | Rate: 400ms          │
│ Range: 350 | Anti-swarm            │
│ Unlocked at Level 4                 │
└─────────────────────────────────────┘
```

### Performance Considerations

**Optimization Strategies**:
1. **Spatial Grid**: Each train car registered separately for efficient targeting
2. **Entity Pooling**: Reuse destroyed car entities (future optimization)
3. **Batch Updates**: Update all car transforms in single pass
4. **Weapon Firing**: Stagger weapon fire times to distribute CPU load
5. **Visual Culling**: Don't render cars off-screen (Phaser handles this)

**Performance Targets**:
- 60fps with 5 cars + 100 enemies + 5 weapons firing
- <100ms save/load time for max configuration
- <50ms for spatial grid queries with 150 entities
- <2MB bundle size increase from V1.5

### Testing Specifications

**Unit Test Coverage Requirements**:
- TrainSystem: 100% (critical path)
- WeaponSystem: 100% (critical path)
- GameState train methods: 100%
- Enemy spawn logic: 90%
- UI components: 80%

**Integration Test Scenarios**:
1. Multi-car train takes damage rear-to-front
2. Engine destruction triggers game over
3. Multiple weapons fire independently
4. Enemy variants spawn according to level
5. Save/load preserves train configuration
6. Car removal refunds correct amount
7. Weapon equip/unequip updates inventory

**Visual Regression Tests**:
1. Upgrade scene with all tabs
2. Train cars tab with various configurations
3. Weapons tab with inventory
4. Game scene with 5-car train
5. Enemy variants visual distinction

**Performance Benchmarks**:
1. Spatial grid query: <1ms for 150 entities
2. Train damage propagation: <0.5ms
3. Weapon firing (5 weapons): <2ms
4. Full game loop: <16ms (60fps)
5. Save serialization: <50ms

---

## 12. Resolved Design Decisions

All critical questions have been resolved. See section 11 for implementation details based on these decisions.

---

## 13. Next Steps

### Pre-Implementation Checklist

- [ ] Review and approve this comprehensive initiative document
- [ ] Create feature branch: `feature/v2-0-loadout-expansion`
- [ ] Set up project board with tasks from Phase 0-6
- [ ] Schedule kickoff meeting with development team
- [ ] Allocate 3-4 week timeline

### Phase 0 Preparation (Before Implementation)

**Dependencies to Install**:
```bash
npm install -D @playwright/test@^1.40.0
npm install -D @vitest/coverage-v8@^2.1.9
npm install -D @vitest/ui@^2.1.9
npx playwright install
```

**Directory Structure to Create**:
```
tests/
├── visual/
│   └── playwright.config.ts
├── integration/
│   └── setup.ts
└── benchmarks/
    └── vitest.bench.config.ts
```

**Documentation to Create**:
- ADR-0005: Train Composition Architecture
- ADR-0006: Weapon System Design
- ADR-0007: Testing Strategy
- Testing Guidelines in memory bank

### Success Criteria Review

Before marking this initiative complete, verify:
- [ ] All functional requirements met (section 2)
- [ ] All technical requirements met (section 2)
- [ ] All quality requirements met (section 2)
- [ ] Test coverage >80% for new code
- [ ] Performance benchmarks met
- [ ] Documentation complete (3 ADRs + 2 guides)
- [ ] Code review approved
- [ ] Playtesting feedback incorporated
- [ ] Save file migration tested with V1.5 saves

---

## 14. Appendix

### A. File Structure Changes

**New Files**:
```
src/
├── components/
│   ├── TrainCar.ts
│   ├── Weapon.ts
│   ├── Hardpoint.ts
│   └── Explosion.ts
├── systems/
│   ├── TrainSystem.ts
│   └── WeaponSystem.ts
├── config/
│   ├── EnemyTypes.ts
│   ├── WeaponTypes.ts
│   └── CarTypes.ts
└── __tests__/
    ├── TrainSystem.test.ts
    ├── WeaponSystem.test.ts
    └── EnemyTypes.test.ts

tests/
├── visual/
│   ├── playwright.config.ts
│   ├── upgrade-scene.spec.ts
│   └── game-scene.spec.ts
├── integration/
│   ├── train-composition.test.ts
│   ├── multi-weapon.test.ts
│   └── save-migration.test.ts
└── benchmarks/
    ├── spatial-grid.bench.ts
    ├── game-loop.bench.ts
    └── train-system.bench.ts

docs/
├── adr/
│   ├── 0005-train-composition-architecture.md
│   ├── 0006-weapon-system-design.md
│   └── 0007-testing-strategy.md
└── guides/
    ├── adding-car-types.md
    └── adding-weapon-types.md
```

**Modified Files**:
```
src/
├── scenes/
│   ├── GameScene.ts         (train initialization, system integration)
│   └── UpgradeScene.ts      (tabbed interface, car/weapon management)
├── systems/
│   ├── CombatSystem.ts      (extract weapon logic, delegate to WeaponSystem)
│   ├── SpawnerSystem.ts     (enemy variant spawning)
│   └── UISystem.ts          (multi-car health display)
├── state/
│   ├── GameState.ts         (train configuration, save migration)
│   └── UpgradeDefinitions.ts (car/weapon configs)
├── ecs/
│   └── Entity.ts            (add 'train-car' and 'weapon' types)
└── components/
    └── Combat.ts            (extend for weapon types)
```

### B. Estimated Line Count Changes

**New Code**:
- Components: ~150 lines
- Systems: ~600 lines
- Config: ~200 lines
- Tests: ~1200 lines
- Documentation: ~800 lines
- **Total New**: ~2950 lines

**Modified Code**:
- GameScene: +150 lines
- UpgradeScene: +300 lines
- CombatSystem: +50 lines (refactor)
- GameState: +200 lines
- Other: +100 lines
- **Total Modified**: ~800 lines

**Total Project Growth**: ~3750 lines (~40% increase from V1.5)

### C. Glossary

**Terms**:
- **Train Composition**: The ordered collection of train cars forming the complete train
- **Hardpoint**: A weapon mounting slot on a gun car
- **Weapon Inventory**: Player's collection of owned weapons available for equipping
- **Car Type**: Engine, Gun Car, or Cargo Car
- **Weapon Type**: Default, Gatling, or Cannon
- **Enemy Variant**: Shambler, Bloater, or Runner
- **Damage Propagation**: Routing damage to the rearmost car first
- **Spawn Weight**: Probability weight for enemy type selection
- **Save Migration**: Converting V1.5 save format to V2.0 format

### D. References

**Internal Documentation**:
- [GDD: V1.0 Core Prototype](../../gdd/01-v1-core-prototype.md)
- [GDD: Future Versions](../../gdd/02-future-versions.md)
- [ADR-0003: Spatial Partitioning](../../adr/0003-use-spatial-partitioning-for-targeting.md)
- [ADR-0004: ECS Architecture](../../adr/0004-use-ecs-architecture.md)
- [Memory Bank: Guidelines](../../../.amazonq/rules/memory-bank/guidelines.md)
- [Memory Bank: Product](../../../.amazonq/rules/memory-bank/product.md)
- [Memory Bank: Structure](../../../.amazonq/rules/memory-bank/structure.md)
- [Memory Bank: Tech](../../../.amazonq/rules/memory-bank/tech.md)

**External Resources**:
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [ECS Pattern](https://gameprogrammingpatterns.com/component.html)
- [Data-Oriented Design](https://www.dataorienteddesign.com/dodbook/)

---

## 15. Change Log

**2025-01-XX - Comprehensive Update**:
- Expanded from initial proposal to full implementation specification
- Added detailed architecture analysis and decisions
- Incorporated testing strategy (visual, integration, performance)
- Added implementation details section with concrete specifications
- Resolved all 15 design questions with stakeholder input
- Added comprehensive appendices (file structure, glossary, references)
- Status changed from "Proposed" to "In Progress"
- Priority elevated from "Medium" to "High"
- Estimated effort: 3-4 weeks

**2025-11-02 - Initial Creation**:
- Created initiative document
- Defined objectives and scope
- Outlined 3 phases
- Identified initial risks

### Architecture Questions

1. **Train Entity Hierarchy**: Should the train be a single "parent" entity with child car entities, or should cars be independent entities with a "train composition" component that links them?
   - **DECISION**: Independent entities with composition component for flexibility. Lead car will likely differ from other car types as functionality expands.

2. **Weapon Ownership**: Should weapons be entities or components on gun cars?
   - **DECISION**: Weapons as entities for consistency with ECS and future extensibility

3. **Damage Routing**: Should TrainSystem intercept all damage to train entities, or should CombatSystem be aware of train composition?
   - **DECISION**: TrainSystem intercepts for separation of concerns

### Design Questions

4. **Car Limits**: Should there be a maximum number of cars? What should it be?
   - **DECISION**: 5 cars maximum (1 engine + 4 additional) for balance and performance

5. **Car Removal**: Should players be able to remove cars? If so, what's the refund policy?
   - **DECISION**: Yes, 70% scrap refund to allow experimentation without being too punishing (tunable)

6. **Weapon Inventory**: Should weapons be consumable (one-time purchase per slot) or inventory items (purchase once, equip anywhere)?
   - **DECISION**: Inventory items for better player experience

7. **Starting Configuration**: Should new players start with just the engine, or engine + one gun car?
   - **DECISION**: Engine only, unlock gun car at level 2 for progression curve

### UI/UX Questions

8. **Loadout Management**: Should weapon equipping be in the upgrade scene or a separate "garage" scene?
   - **DECISION**: Tabbed interface in upgrade scene for simplicity

9. **Visual Feedback**: How should we visually distinguish different car types and weapons?
   - **DECISION**: Color coding + shape variations (rectangles with different sizes/decorations)

10. **Tutorial**: Do we need an in-game tutorial for the new systems?
    - **DECISION**: Yes, simple tooltip-based tutorial on first visit to each new tab

### Testing Questions

11. **Golden Test Maintenance**: How often should we update golden test snapshots during active development?
    - **DECISION**: Update at end of each phase, document changes in commit messages

12. **Visual Test Threshold**: What pixel difference threshold should trigger visual regression test failures?
    - **DECISION**: Start with 0.1% difference, adjust based on false positive rate

13. **Performance Benchmarks**: What's our target frame time budget for the game loop?
    - **DECISION**: <16ms (60fps) with 5 cars + 100 enemies as worst case

### Balance Questions

14. **Enemy Scaling**: Should enemy difficulty scale with train power (more cars = harder enemies)?
    - **DECISION**: Not for V2.0, keep current level-based scaling

15. **Weapon Balance**: Should all weapons be viable, or should some be strictly better (progression)?
    - **DECISION**: All viable with different use cases (Gatling for swarms, Cannon for tough enemies)

---

## Session Notes (2025-11-07)

**Phase 0-2 Complete**: PR #15 ready for merge
- All critical issues resolved (type safety, damage cascade, test structure)
- 58 tests passing, 100% coverage for new systems
- All review feedback addressed
- Next session: Begin Phase 3 (State Management & Persistence)
