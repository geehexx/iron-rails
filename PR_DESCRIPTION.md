# V2.0 Loadout Expansion - Phase 0, 1, 2 Complete

## Overview

This PR implements the foundational infrastructure for V2.0 Loadout Expansion, completing Phase 0 (Testing Infrastructure), Phase 1 (Component & System Foundation), and Phase 2 (Enemy Variants) of the initiative.

## What's Included

### Phase 0: Testing Infrastructure ✅

**Goal**: Establish robust testing foundation before major refactoring

- ✅ Installed Playwright for visual regression testing
- ✅ Set up Phaser headless mode for integration tests
- ✅ Configured Vitest coverage reporting with v8 provider
- ✅ Created test utilities for ECS entity creation
- ✅ Established baseline performance benchmarks
- ✅ Documented testing guidelines in memory bank
- ✅ Created ADR-0005 for testing strategy

**Performance Baseline**:
- insert 100 entities: ~0.02ms (48,639 ops/sec) ✅
- queryRadius 100 entities: ~0.03ms (38,017 ops/sec) ✅
- queryRadius 150 entities: ~0.05ms (21,009 ops/sec) ✅

### Phase 1: Component & System Foundation ✅

**Goal**: Create new components and systems without breaking existing functionality

#### New Components (4 files)
- `TrainCar.ts`: carType, position, hardpoints
- `Weapon.ts`: weaponType, damage, fireRate, range, lastFired
- `Hardpoint.ts`: weaponId, offsetX, offsetY
- `Explosion.ts`: radius, damage (for Bloater AOE)

#### New Systems (2 files)
- `TrainSystem.ts`: Multi-car composition, damage routing, positioning
  - Manages train car composition (ordered array)
  - Routes damage to rearmost car first
  - Handles car destruction cascade
  - Detects game over (engine destroyed)
  - Aggregates health across all cars
- `WeaponSystem.ts`: Weapon firing logic with type-specific behavior
  - Fires weapons at nearest enemies
  - Respects fire rate cooldowns
  - Supports multiple weapon types (default, gatling, cannon)

#### Entity & World Updates
- Added new component types to Entity interface
- Added 'train-car' and 'weapon' entity types
- Added `getEntity()` and `removeEntity()` methods to World

#### Test Coverage
- TrainSystem: 8 tests (100% coverage)
- WeaponSystem: 6 tests (100% coverage)
- All existing tests still passing

### Phase 2: Enemy Variants ✅

**Goal**: Implement Bloater and Runner enemy types with unique behaviors

#### Enemy Type System
- `EnemyTypes.ts` configuration with three enemy types:
  - **Shambler**: 3 HP, -30 speed, 80 radius, 1 damage, 1 scrap (green)
  - **Bloater**: 10 HP, -20 speed, 150 radius, 2 damage, 3 scrap (orange)
  - **Runner**: 1 HP, -80 speed, 60 radius, 1 damage, 2 scrap (red)

#### Spawn System
- Weighted spawn tables by level:
  - Level 1-2: 100% Shambler
  - Level 3: 80% Shambler, 15% Runner, 5% Bloater
  - Level 4: 70% Shambler, 20% Runner, 10% Bloater
  - Level 5+: 60% Shambler, 25% Runner, 15% Bloater
- `selectEnemyType()` function for weighted random selection

#### Test Coverage
- 8 tests covering configs, spawn tables, and selection
- All tests passing

## Test Results

```
Test Files  9 passed (9)
Tests  58 passed (58)
Duration  ~3-4s
```

## Files Changed

### New Files (13)
- `tests/visual/playwright.config.ts`
- `tests/integration/setup.ts`
- `tests/integration/test-utils.ts`
- `tests/benchmarks/vitest.bench.config.ts`
- `tests/benchmarks/spatial-grid.bench.ts`
- `src/components/TrainCar.ts`
- `src/components/Weapon.ts`
- `src/components/Hardpoint.ts`
- `src/components/Explosion.ts`
- `src/systems/TrainSystem.ts`
- `src/systems/WeaponSystem.ts`
- `src/config/EnemyTypes.ts`
- `src/__tests__/TrainSystem.test.ts`
- `src/__tests__/WeaponSystem.test.ts`
- `src/__tests__/EnemyTypes.test.ts`
- `docs/adr/0005-testing-strategy-for-v2.md`
- `.amazonq/rules/memory-bank/testing-guidelines.md`

### Modified Files (5)
- `package.json` - Added test dependencies and scripts
- `package-lock.json` - Dependency updates
- `vitest.config.ts` - Added coverage configuration
- `src/ecs/Entity.ts` - Added new component and entity types
- `src/ecs/World.ts` - Added getEntity() and removeEntity() methods
- `docs/initiatives/active/20251102-V2-0-Loadout-Expansion-Implementation.md` - Progress tracking

## Breaking Changes

None. All existing functionality preserved and all existing tests passing.

## Next Steps (Not in this PR)

- Phase 3: State Management & Persistence
- Phase 4: Game Scene Integration
- Phase 5: UI Implementation
- Phase 6: Testing, Balancing & Documentation

## Documentation

- ADR-0005: Testing Strategy for V2.0
- Testing Guidelines added to memory bank
- Initiative document updated with progress

## Checklist

- [x] All tests passing (58/58)
- [x] No breaking changes to existing code
- [x] TypeScript strict mode compliance
- [x] Performance benchmarks established
- [x] Documentation updated
- [x] ADR created for testing strategy
- [x] Memory bank updated with testing guidelines

## Related

- Initiative: [V2.0 Loadout Expansion Implementation](docs/initiatives/active/20251102-V2-0-Loadout-Expansion-Implementation.md)
- ADR: [0005-testing-strategy-for-v2.md](docs/adr/0005-testing-strategy-for-v2.md)
