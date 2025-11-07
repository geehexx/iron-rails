import { World } from '../../src/ecs/World';
import { Entity, EntityId } from '../../src/ecs/Entity';
import { Transform } from '../../src/components/Transform';
import { Health } from '../../src/components/Health';
import { Combat } from '../../src/components/Combat';
import { Velocity } from '../../src/components/Velocity';

export function createTestEntity(
  world: World,
  type: string,
  components: Partial<Entity> = {}
): EntityId {
  const entity: Entity = {
    id: world.createEntity(),
    type,
    ...components,
  };
  
  world.addEntity(entity);
  return entity.id;
}

export function createTestTrain(world: World, x = 200, y = 360): EntityId {
  return createTestEntity(world, 'train', {
    transform: { x, y },
    health: { current: 10, max: 10 },
    combat: { damage: 1, range: 400, fireRate: 800, lastFired: 0 },
    velocity: { vx: 0, vy: 0 },
  });
}

export function createTestEnemy(world: World, x = 700, y = 360): EntityId {
  return createTestEntity(world, 'enemy', {
    transform: { x, y },
    health: { current: 3, max: 3 },
    velocity: { vx: -30, vy: 0 },
  });
}
