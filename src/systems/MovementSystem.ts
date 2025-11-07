import Phaser from 'phaser';
import { World } from '../ecs/World';
import { SpatialGrid } from './SpatialGrid';

type Positionable = {
  setPosition: (x: number, y: number) => void;
};

function isPositionable(obj: any): obj is Positionable {
  return obj && typeof obj.setPosition === 'function';
}

export class MovementSystem {
  update(world: World, delta: number, spatialGrid: SpatialGrid): void {
    const deltaSeconds = delta / 1000;
    
    world.entities.forEach(entity => {
      if (!entity.velocity || !entity.transform) return;
      
      entity.transform.x += entity.velocity.vx * deltaSeconds;
      entity.transform.y += entity.velocity.vy * deltaSeconds;
      
      if (isPositionable(entity.sprite)) {
        entity.sprite.setPosition(entity.transform.x, entity.transform.y);
      }
      
      spatialGrid.update(entity.id, entity.transform.x, entity.transform.y);
    });
  }
}
