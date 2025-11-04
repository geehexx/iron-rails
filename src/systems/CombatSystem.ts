import { World } from '../ecs/World';
import { SpatialGrid } from './SpatialGrid';
import { EntityId } from '../ecs/Entity';

export class CombatSystem {
  private readonly EXPLOSION_RADIUS = 80; // AOE radius for zombie explosion
  private readonly EXPLOSION_DAMAGE = 1; // Flat damage to train if in range

  private explodeEnemy(x: number, y: number, world: World): void {
    // Check if train is within explosion radius
    const train = world.getEntitiesByType('train')[0];
    if (!train?.transform || !train.health) return;

    const dist = Math.hypot(train.transform.x - x, train.transform.y - y);
    if (dist <= this.EXPLOSION_RADIUS) {
      train.health.current -= this.EXPLOSION_DAMAGE;
    }
  }

  private findNearestEnemy(
    x: number, y: number, range: number, 
    spatialGrid: SpatialGrid, world: World
  ): EntityId | null {
    const candidates = spatialGrid.queryRadius(x, y, range);
    let nearest: EntityId | null = null;
    let minDist = Infinity;

    for (const id of candidates) {
      const entity = world.entities.get(id);
      if (!entity || entity.type !== 'enemy' || !entity.transform) continue;
      
      const dist = Math.hypot(entity.transform.x - x, entity.transform.y - y);
      if (dist < minDist) {
        minDist = dist;
        nearest = id;
      }
    }
    return nearest;
  }

  update(world: World, time: number, delta: number, spatialGrid: SpatialGrid): void {
    const deltaSeconds = delta / 1000;
    const train = world.getEntitiesByType('train')[0];
    if (!train?.combat || !train.transform) return;

    if (time - train.combat.lastFired < train.combat.fireRate) return;

    const targetId = this.findNearestEnemy(
      train.transform.x, train.transform.y, 
      train.combat.range, spatialGrid, world
    );

    if (targetId !== null) {
      const enemy = world.entities.get(targetId);
      if (enemy?.health && enemy.transform) {
        enemy.health.current -= train.combat.damage;
        if (enemy.health.current <= 0) {
          // Enemy dies - trigger explosion AOE damage
          this.explodeEnemy(enemy.transform.x, enemy.transform.y, world);
          world.destroyEntity(targetId);
          spatialGrid.remove(targetId);
        }
      }
      train.combat.lastFired = time;
    }
  }
}
