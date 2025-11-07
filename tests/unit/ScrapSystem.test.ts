import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScrapSystem } from '../../src/systems/ScrapSystem';
import { World } from '../../src/ecs/World';
import { SpatialGrid } from '../../src/systems/SpatialGrid';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {
      add = {
        circle: vi.fn(() => ({
          setStrokeStyle: vi.fn()
        }))
      };
      time = {
        delayedCall: vi.fn()
      };
    }
  }
}));

describe('ScrapSystem', () => {
  let scrapSystem: ScrapSystem;
  let world: World;
  let spatialGrid: SpatialGrid;
  let mockScene: any;

  beforeEach(() => {
    scrapSystem = new ScrapSystem();
    world = new World();
    spatialGrid = new SpatialGrid(100);
    mockScene = {
      add: {
        circle: vi.fn(() => ({
          setStrokeStyle: vi.fn(),
          destroy: vi.fn()
        }))
      },
      time: {
        delayedCall: vi.fn()
      }
    };
  });

  describe('spawnScrap', () => {
    it('should create scrap entity at specified location', () => {
      scrapSystem.spawnScrap(100, 200, world, mockScene, spatialGrid);
      
      const scrapEntities = world.getEntitiesByType('scrap');
      expect(scrapEntities).toHaveLength(1);
      
      const scrap = scrapEntities[0];
      expect(scrap).toBeDefined();
      expect(scrap?.transform?.x).toBe(100);
      expect(scrap?.transform?.y).toBe(200);
      expect(scrap?.scrap?.value).toBe(1);
    });

    it('should register scrap in spatial grid', () => {
      scrapSystem.spawnScrap(100, 200, world, mockScene, spatialGrid);
      
      const nearby = spatialGrid.queryRadius(100, 200, 50);
      expect(nearby.length).toBeGreaterThan(0);
    });

    it('should create visual representation', () => {
      scrapSystem.spawnScrap(100, 200, world, mockScene, spatialGrid);
      
      expect(mockScene.add.circle).toHaveBeenCalledWith(100, 200, 8, 0xffaa00);
    });

    it('should schedule auto-destruction', () => {
      scrapSystem.spawnScrap(100, 200, world, mockScene, spatialGrid);
      
      expect(mockScene.time.delayedCall).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should collect scrap near train', () => {
      const train = world.createEntity('train');
      train.transform = { x: 100, y: 100, rotation: 0 };
      spatialGrid.insert(train.id, 100, 100);

      scrapSystem.spawnScrap(120, 110, world, mockScene, spatialGrid);
      
      let collectedAmount = 0;
      scrapSystem.update(world, spatialGrid, (amount) => {
        collectedAmount += amount;
      });

      expect(collectedAmount).toBe(1);
      expect(world.getEntitiesByType('scrap')).toHaveLength(0);
    });

    it('should not collect scrap far from train', () => {
      const train = world.createEntity('train');
      train.transform = { x: 100, y: 100, rotation: 0 };
      spatialGrid.insert(train.id, 100, 100);

      scrapSystem.spawnScrap(500, 500, world, mockScene, spatialGrid);
      
      let collectedAmount = 0;
      scrapSystem.update(world, spatialGrid, (amount) => {
        collectedAmount += amount;
      });

      expect(collectedAmount).toBe(0);
      expect(world.getEntitiesByType('scrap')).toHaveLength(1);
    });

    it('should handle no train gracefully', () => {
      scrapSystem.spawnScrap(100, 100, world, mockScene, spatialGrid);
      
      expect(() => {
        scrapSystem.update(world, spatialGrid, () => {});
      }).not.toThrow();
      
      expect(world.getEntitiesByType('scrap')).toHaveLength(1);
    });
  });
});
