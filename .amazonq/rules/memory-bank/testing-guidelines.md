# Testing Guidelines

## Testing Philosophy

- **Test behavior, not implementation**: Focus on what the code does, not how
- **Minimal test code**: Write only essential assertions
- **Fast feedback**: Unit tests should run in milliseconds
- **Isolated tests**: Each test should be independent

## Test Structure

### Unit Tests (Vitest)

**Location:** `src/__tests__/*.test.ts`

**Pattern:**
```typescript
describe('ComponentName', () => {
  let instance: ComponentType;

  beforeEach(() => {
    localStorage.clear();
    instance = new ComponentType();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Feature Group', () => {
    it('should describe expected behavior', () => {
      expect(result).toBe(expected);
    });
  });
});
```

**Coverage Target:** >80% for new code, 100% for critical paths

### Integration Tests (Phaser Headless)

**Location:** `tests/integration/*.test.ts`

**Pattern:**
```typescript
import { createHeadlessGame, destroyGame } from './setup';
import { createTestTrain, createTestEnemy } from './test-utils';

describe('Multi-car Train', () => {
  let game: Phaser.Game;

  beforeEach(() => {
    game = createHeadlessGame(GameScene);
  });

  afterEach(() => {
    destroyGame(game);
  });

  it('should route damage to rearmost car', () => {
    // Test logic
  });
});
```

### Visual Tests (Playwright)

**Location:** `tests/visual/*.spec.ts`

**Pattern:**
```typescript
import { test, expect } from '@playwright/test';

test('upgrade scene renders correctly', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.upgrade-scene');
  await expect(page).toHaveScreenshot('upgrade-scene.png', {
    maxDiffPixels: 100,
  });
});
```

**Snapshot Updates:** Run `npm run test:visual -- --update-snapshots` when intentional changes occur

### Performance Benchmarks

**Location:** `tests/benchmarks/*.bench.ts`

**Pattern:**
```typescript
import { bench, describe } from 'vitest';

describe('System Performance', () => {
  bench('operation description', () => {
    // Operation to benchmark
  });
});
```

**Targets:**
- Spatial grid query: <1ms
- System updates: <2ms
- Game loop: <16ms (60fps)

## Test Utilities

### Entity Creation

Use `test-utils.ts` for consistent entity creation:

```typescript
import { createTestTrain, createTestEnemy } from './test-utils';

const trainId = createTestTrain(world, 200, 360);
const enemyId = createTestEnemy(world, 700, 360);
```

### Headless Game Setup

Use `setup.ts` for Phaser headless configuration:

```typescript
import { createHeadlessGame, destroyGame } from './setup';

const game = createHeadlessGame(GameScene);
// Test logic
destroyGame(game);
```

## Running Tests

```bash
npm test                  # Run unit tests
npm run test:coverage     # Run with coverage report
npm run test:ui           # Open Vitest UI
npm run test:visual       # Run visual regression tests
npm run test:bench        # Run performance benchmarks
```

## Best Practices

### Unit Tests

- Mock external dependencies (localStorage, Phaser objects)
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused (one assertion per test when possible)

### Integration Tests

- Test realistic scenarios
- Validate multi-system interactions
- Clean up resources (destroy game instances)
- Use headless mode for speed

### Visual Tests

- Update snapshots only for intentional changes
- Document snapshot updates in commit messages
- Use consistent viewport sizes
- Wait for animations to complete

### Performance Tests

- Run benchmarks on consistent hardware
- Compare against baseline metrics
- Profile before optimizing
- Document performance targets

## Coverage Requirements

- **New Systems:** 100% coverage
- **New Components:** Type validation only
- **Modified Systems:** Maintain existing coverage
- **UI Components:** 80% coverage
- **Integration Flows:** All critical paths

## CI/CD Integration

Tests run automatically on:
- Pull request creation
- Push to feature branches
- Merge to main

Failed tests block merging.
