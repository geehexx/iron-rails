# ADR-0005: Testing Strategy for V2.0

**Status:** Accepted  
**Date:** 2025-01-XX  
**Deciders:** Development Team  
**Context:** V2.0 Loadout Expansion Initiative

## Context

V2.0 introduces significant architectural changes including multi-car trains, weapon systems, and enemy variants. The existing test suite (6 unit test files with Vitest) is insufficient for validating these complex interactions. We need a comprehensive testing strategy that covers unit, integration, visual, and performance testing.

## Decision

We will implement a multi-layered testing approach:

### 1. Unit Testing (Vitest)

**Scope:** Individual components and systems in isolation
**Coverage Target:** >80% for all new code, 100% for critical paths
**Tools:** Vitest 2.1.9 with jsdom, @vitest/coverage-v8

**Approach:**
- Test data-only components for type correctness
- Test systems with mocked dependencies
- Test state management with localStorage mocking
- Use test utilities for entity creation

### 2. Integration Testing (Phaser Headless)

**Scope:** Multi-system interactions and game loop behavior
**Coverage Target:** All critical user flows
**Tools:** Phaser HEADLESS mode with Vitest

**Approach:**
- Test multi-car train damage propagation
- Test weapon firing with multiple weapons
- Test enemy spawning and behavior
- Test save/load with complex configurations

### 3. Visual Regression Testing (Playwright)

**Scope:** UI layouts and visual elements
**Coverage Target:** All UI screens and major UI states
**Tools:** Playwright 1.40.0 with screenshot comparison

**Approach:**
- Test upgrade scene tabs
- Test train car management UI
- Test weapon loadout UI
- Pixel difference threshold: 0.1%

### 4. Performance Benchmarking (Vitest Bench)

**Scope:** Performance-critical operations
**Coverage Target:** All hot paths and worst-case scenarios
**Tools:** Vitest benchmark mode

**Targets:**
- Spatial grid query: <1ms for 150 entities
- Train damage propagation: <0.5ms
- Weapon firing (5 weapons): <2ms
- Full game loop: <16ms (60fps)
- Save serialization: <50ms

## Consequences

### Positive

- **Confidence:** Comprehensive coverage reduces regression risk
- **Performance:** Early detection of performance issues
- **Maintainability:** Tests document expected behavior
- **Quality:** Visual tests catch UI regressions

### Negative

- **Setup Time:** Initial infrastructure setup adds ~1 week
- **Maintenance:** Visual tests require snapshot updates
- **CI Time:** Longer test suite increases CI duration
- **Complexity:** Multiple testing tools to learn and maintain

### Mitigation

- Parallel test execution to reduce CI time
- Clear documentation for snapshot update process
- Test utilities to simplify test creation
- Gradual adoption: Phase 0 establishes foundation

## Implementation

### Directory Structure

```
tests/
├── visual/
│   ├── playwright.config.ts
│   └── *.spec.ts
├── integration/
│   ├── setup.ts
│   ├── test-utils.ts
│   └── *.test.ts
└── benchmarks/
    ├── vitest.bench.config.ts
    └── *.bench.ts
```

### Test Scripts

```json
{
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "test:ui": "vitest --ui",
  "test:visual": "playwright test -c tests/visual/playwright.config.ts",
  "test:bench": "vitest bench -c tests/benchmarks/vitest.bench.config.ts"
}
```

### Coverage Configuration

- Provider: v8 (faster than istanbul)
- Reporters: text, json, html
- Exclude: node_modules, tests, config files

## Related

- [ADR-0004: ECS Architecture](./0004-use-ecs-architecture.md)
- [ADR-0003: Spatial Partitioning](./0003-use-spatial-partitioning-for-targeting.md)
- [Initiative: V2.0 Loadout Expansion](../initiatives/active/20251102-V2-0-Loadout-Expansion-Implementation.md)
