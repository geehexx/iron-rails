import { describe, it, expect, beforeEach } from 'vitest';
import { TrainSystem } from '../../src/systems/TrainSystem';
import { World } from '../../src/ecs/World';

describe('TrainSystem', () => {
  let system: TrainSystem;
  let world: World;

  beforeEach(() => {
    system = new TrainSystem();
    world = new World();
  });

  describe('Train Composition', () => {
    it('should set and get train composition', () => {
      const carIds = [1, 2, 3];
      system.setTrainComposition(carIds);
      expect(system.getTrainComposition()).toEqual(carIds);
    });

    it('should return copy of composition array', () => {
      const carIds = [1, 2, 3];
      system.setTrainComposition(carIds);
      const result = system.getTrainComposition();
      result.push(4);
      expect(system.getTrainComposition()).toEqual([1, 2, 3]);
    });
  });

  describe('Car Positioning', () => {
    it('should position cars behind engine', () => {
      const engine = world.createEntity('train-car');
      const car1 = world.createEntity('train-car');
      const car2 = world.createEntity('train-car');

      engine.transform = { x: 200, y: 360 };
      engine.velocity = { vx: 50, vy: 0 };
      car1.transform = { x: 0, y: 0 };
      car2.transform = { x: 0, y: 0 };

      system.setTrainComposition([engine.id, car1.id, car2.id]);
      system.update(world);

      expect(car1.transform.x).toBe(150);
      expect(car1.transform.y).toBe(360);
      expect(car2.transform.x).toBe(100);
      expect(car2.transform.y).toBe(360);
    });
  });

  describe('Damage Routing', () => {
    it('should route damage to rearmost car', () => {
      const engine = world.createEntity('train-car');
      const car = world.createEntity('train-car');

      engine.health = { current: 10, max: 10 };
      car.health = { current: 8, max: 8 };

      system.setTrainComposition([engine.id, car.id]);
      system.routeDamage(world, 3);

      expect(car.health.current).toBe(5);
    });

    it('should destroy car when health reaches zero', () => {
      const engine = world.createEntity('train-car');
      const car = world.createEntity('train-car');

      engine.health = { current: 10, max: 10 };
      car.health = { current: 5, max: 8 };

      system.setTrainComposition([engine.id, car.id]);
      system.routeDamage(world, 5);

      expect(system.getTrainComposition()).toEqual([engine.id]);
      expect(world.getEntity(car.id)).toBeUndefined();
    });

    it('should route damage to next car after rear destroyed', () => {
      const engine = world.createEntity('train-car');
      const car1 = world.createEntity('train-car');
      const car2 = world.createEntity('train-car');

      engine.health = { current: 10, max: 10 };
      car1.health = { current: 8, max: 8 };
      car2.health = { current: 5, max: 8 };

      system.setTrainComposition([engine.id, car1.id, car2.id]);
      system.routeDamage(world, 5);
      system.routeDamage(world, 3);

      expect(car1.health.current).toBe(5);
      expect(system.getTrainComposition()).toEqual([engine.id, car1.id]);
    });
  });

  describe('Game Over Condition', () => {
    it('should detect engine destroyed', () => {
      const engine = world.createEntity('train-car');
      engine.health = { current: 10, max: 10 };

      system.setTrainComposition([engine.id]);
      expect(system.isEngineDestroyed(world)).toBe(false);

      system.routeDamage(world, 10);
      expect(system.isEngineDestroyed(world)).toBe(true);
    });
  });

  describe('Health Aggregation', () => {
    it('should calculate total health across all cars', () => {
      const engine = world.createEntity('train-car');
      const car1 = world.createEntity('train-car');
      const car2 = world.createEntity('train-car');

      engine.health = { current: 10, max: 10 };
      car1.health = { current: 5, max: 8 };
      car2.health = { current: 15, max: 20 };

      system.setTrainComposition([engine.id, car1.id, car2.id]);
      const health = system.getTotalHealth(world);

      expect(health.current).toBe(30);
      expect(health.max).toBe(38);
    });
  });
});
