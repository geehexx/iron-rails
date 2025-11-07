import { describe, it, expect, beforeEach } from 'vitest';
import { WeaponSystem } from '../../src/systems/WeaponSystem';
import { World } from '../../src/ecs/World';
import { SpatialGrid } from '../../src/systems/SpatialGrid';

describe('WeaponSystem', () => {
  let system: WeaponSystem;
  let world: World;
  let spatialGrid: SpatialGrid;

  beforeEach(() => {
    system = new WeaponSystem();
    world = new World();
    spatialGrid = new SpatialGrid(100);
  });

  describe('Weapon Firing', () => {
    it('should fire at enemy in range', () => {
      const weapon = world.createEntity('weapon');
      const enemy = world.createEntity('enemy');

      weapon.transform = { x: 200, y: 360 };
      weapon.weapon = {
        weaponType: 'default',
        damage: 1,
        fireRate: 800,
        range: 400,
        lastFired: 0,
      };

      enemy.transform = { x: 500, y: 360 };
      enemy.health = { current: 3, max: 3 };

      spatialGrid.insert(enemy.id.toString(), 500, 360);

      system.update(world, 1000, spatialGrid);

      expect(enemy.health.current).toBe(2);
    });

    it('should not fire before fire rate cooldown', () => {
      const weapon = world.createEntity('weapon');
      const enemy = world.createEntity('enemy');

      weapon.transform = { x: 200, y: 360 };
      weapon.weapon = {
        weaponType: 'default',
        damage: 1,
        fireRate: 800,
        range: 400,
        lastFired: 500,
      };

      enemy.transform = { x: 500, y: 360 };
      enemy.health = { current: 3, max: 3 };

      spatialGrid.insert(enemy.id.toString(), 500, 360);

      system.update(world, 1000, spatialGrid);

      expect(enemy.health.current).toBe(3);
    });

    it('should target nearest enemy', () => {
      const weapon = world.createEntity('weapon');
      const enemy1 = world.createEntity('enemy');
      const enemy2 = world.createEntity('enemy');

      weapon.transform = { x: 200, y: 360 };
      weapon.weapon = {
        weaponType: 'default',
        damage: 1,
        fireRate: 800,
        range: 400,
        lastFired: 0,
      };

      enemy1.transform = { x: 500, y: 360 };
      enemy1.health = { current: 3, max: 3 };

      enemy2.transform = { x: 400, y: 360 };
      enemy2.health = { current: 3, max: 3 };

      spatialGrid.insert(enemy1.id.toString(), 500, 360);
      spatialGrid.insert(enemy2.id.toString(), 400, 360);

      system.update(world, 1000, spatialGrid);

      expect(enemy1.health.current).toBe(3);
      expect(enemy2.health.current).toBe(2);
    });

    it('should destroy enemy when health reaches zero', () => {
      const weapon = world.createEntity('weapon');
      const enemy = world.createEntity('enemy');

      weapon.transform = { x: 200, y: 360 };
      weapon.weapon = {
        weaponType: 'default',
        damage: 3,
        fireRate: 800,
        range: 400,
        lastFired: 0,
      };

      enemy.transform = { x: 500, y: 360 };
      enemy.health = { current: 3, max: 3 };

      spatialGrid.insert(enemy.id.toString(), 500, 360);

      system.update(world, 1000, spatialGrid);

      expect(world.getEntity(enemy.id)).toBeUndefined();
    });
  });

  describe('Weapon Types', () => {
    it('should apply gatling stats', () => {
      const weapon = world.createEntity('weapon');
      const enemy = world.createEntity('enemy');

      weapon.transform = { x: 200, y: 360 };
      weapon.weapon = {
        weaponType: 'gatling',
        damage: 0.5,
        fireRate: 400,
        range: 350,
        lastFired: 0,
      };

      enemy.transform = { x: 450, y: 360 };
      enemy.health = { current: 3, max: 3 };

      spatialGrid.insert(enemy.id.toString(), 450, 360);

      system.update(world, 1000, spatialGrid);

      expect(enemy.health.current).toBe(2.5);
    });

    it('should apply cannon stats', () => {
      const weapon = world.createEntity('weapon');
      const enemy = world.createEntity('enemy');

      weapon.transform = { x: 200, y: 360 };
      weapon.weapon = {
        weaponType: 'cannon',
        damage: 5,
        fireRate: 2000,
        range: 450,
        lastFired: 0,
      };

      enemy.transform = { x: 400, y: 360 };
      enemy.health = { current: 10, max: 10 };

      spatialGrid.insert(enemy.id.toString(), 400, 360);

      system.update(world, 2000, spatialGrid);

      expect(enemy.health.current).toBe(5);
    });
  });
});
