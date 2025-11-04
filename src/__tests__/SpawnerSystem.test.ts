import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpawnerSystem } from '../systems/SpawnerSystem';
import { World } from '../ecs/World';

// Mock Phaser module to avoid canvas initialization
vi.mock('phaser', () => ({
  default: {
    Math: {
      Between: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
}));

describe('SpawnerSystem', () => {
  let world: World;
  let spawner: SpawnerSystem;

  beforeEach(() => {
    world = new World();
    spawner = new SpawnerSystem();
  });

  it('spawns enemies after interval', () => {
    const mockScene = { add: { rectangle: () => ({}) } } as any;
    
    // First spawn happens immediately at time 0 (first frame)
    spawner.update(world, 0, mockScene);
    expect(world.entities.size).toBe(0); // No spawn yet, 0 elapsed time
    
    // At 2000ms, first enemy spawns
    spawner.update(world, 2000, mockScene);
    expect(world.entities.size).toBe(1);
    
    // At 3000ms, still only one enemy (interval not met)
    spawner.update(world, 3000, mockScene);
    expect(world.entities.size).toBe(1);
    
    // At 4100ms, second enemy spawns (>2000ms since last spawn)
    spawner.update(world, 4100, mockScene);
    expect(world.entities.size).toBe(2);
  });
});
