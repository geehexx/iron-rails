import { describe, it, expect, beforeEach } from 'vitest';
import { CombatSystem } from '../../src/systems/CombatSystem';
import { World } from '../../src/ecs/World';
import { SpatialGrid } from '../../src/systems/SpatialGrid';

describe('CombatSystem', () => {
  let world: World;
  let combat: CombatSystem;
  let grid: SpatialGrid;

  beforeEach(() => {
    world = new World();
    combat = new CombatSystem();
    grid = new SpatialGrid(50);
  });

  it('damages nearest enemy within range', () => {
    const train = world.createEntity('train');
    train.transform = { x: 100, y: 100, rotation: 0 };
    train.combat = { damage: 1, range: 200, fireRate: 1000, lastFired: 0 };
    grid.insert(train.id, 100, 100);

    const enemy = world.createEntity('enemy');
    enemy.transform = { x: 150, y: 100, rotation: 0 };
    enemy.health = { current: 2, max: 2 };
    grid.insert(enemy.id, 150, 100);

    combat.update(world, 1000, 16, grid);
    expect(enemy.health.current).toBe(1);
  });
});
