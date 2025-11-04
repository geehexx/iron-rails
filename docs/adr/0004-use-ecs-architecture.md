# ADR-0004: Use Entity-Component-System (ECS) Architecture

**Status:** Accepted  
**Date:** 2025-11-04  
**Deciders:** Development Team  
**Related:** [ADR-0001](0001-use-phaser-vite-vitest-stack.md), [ADR-0003](0003-use-spatial-partitioning-for-targeting.md)

---

## Context

Iron Rails requires a flexible, maintainable architecture for managing game entities (train, enemies, projectiles) with varying capabilities. The codebase needs to support:

- Dynamic entity composition (enemies with different abilities, train upgrades)
- Efficient updates across hundreds of entities
- Clear separation of data and logic for testing
- Easy addition of new features without breaking existing code

Traditional object-oriented hierarchies (e.g., `class Enemy extends GameObject`) become rigid and difficult to extend when entities need varied combinations of behaviors.

---

## Decision

We will use the **Entity-Component-System (ECS)** architectural pattern:

### Components

**Pure data interfaces** with no behavior:

- `Transform` - position, rotation
- `Health` - current/max HP
- `Combat` - damage, range, fire rate
- `Velocity` - movement vector

### Entities

**Compositional game objects** defined by their components:

```typescript
interface Entity {
  id: EntityId;
  type: 'train' | 'enemy';
  transform?: Transform;
  health?: Health;
  combat?: Combat;
  velocity?: Velocity;
  sprite?: Phaser.GameObjects.Rectangle;
}
```

### Systems

**Pure logic processors** operating on entities with specific components:

- `SpawnerSystem` - creates enemies with health/velocity
- `MovementSystem` - updates positions based on velocity
- `CombatSystem` - applies damage to targets within range

### World

**Entity lifecycle manager**:

- Creates/destroys entities
- Queries entities by type
- Maintains entity registry

---

## Consequences

### Positive

✅ **Composition over inheritance** - Entities defined by components, not class hierarchy  
✅ **Data-oriented design** - Components are plain data, systems are pure functions  
✅ **Easy testing** - Systems testable in isolation with mock entities  
✅ **Performance** - Systems process entities in batches, cache-friendly  
✅ **Extensibility** - New behaviors = new components + systems, no class refactoring  
✅ **Parallelization potential** - Systems operate independently (future optimization)

### Negative

⚠️ **Learning curve** - Team must understand ECS vs OOP patterns  
⚠️ **Boilerplate** - More files (separate components, systems, entities)  
⚠️ **Type safety challenges** - Optional components require runtime checks  

### Neutral

🔹 **Alternative architectures considered:**

- **OOP Hierarchy** - Rejected: rigid, difficult to extend, violates composition
- **Monolithic GameScene** - Rejected: unmaintainable, untestable at scale
- **Full ECS framework (e.g., BitECS)** - Deferred: adds complexity for V1.0, revisit if performance issues arise

---

## Implementation

### File Structure

```text
src/
├── ecs/
│   ├── Entity.ts       # Entity type definition
│   └── World.ts        # Entity lifecycle management
├── components/         # Data-only interfaces
│   ├── Transform.ts
│   ├── Health.ts
│   ├── Combat.ts
│   └── Velocity.ts
└── systems/           # Logic processors
    ├── SpawnerSystem.ts
    ├── MovementSystem.ts
    └── CombatSystem.ts
```

### Game Loop Integration (GameScene.ts)

```typescript
update(time: number, delta: number): void {
  this.spawnerSystem.update(this.world, time, this);
  this.movementSystem.update(this.world, delta, this.spatialGrid);
  this.combatSystem.update(this.world, time, this.spatialGrid);
  // ... additional game logic
}
```

---

## References

- [Game Programming Patterns - Component](https://gameprogrammingpatterns.com/component.html)
- [Data-Oriented Design](https://www.dataorienteddesign.com/dodbook/)
- [GDD V1.0 Core Prototype](../gdd/01-v1-core-prototype.md)
- [Technical Analysis: AI and Algorithms](../technical_analysis/03-ai-and-algorithms.md)
