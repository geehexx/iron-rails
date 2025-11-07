import { World } from '../ecs/World';
import { SpatialGrid } from './SpatialGrid';

export class WeaponSystem {
  update(world: World, time: number, spatialGrid: SpatialGrid): void {
    const weapons = world.getEntitiesByType('weapon');

    for (const weapon of weapons) {
      if (!weapon.weapon || !weapon.transform) continue;

      if (time - weapon.weapon.lastFired < weapon.weapon.fireRate) continue;

      const candidates = spatialGrid.queryRadius(
        weapon.transform.x,
        weapon.transform.y,
        weapon.weapon.range
      );

      let nearest: string | null = null;
      let minDistSq = Infinity;

      for (const candidateId of candidates) {
        const entity = world.getEntity(Number(candidateId));
        if (!entity || entity.type !== 'enemy' || !entity.transform) continue;

        const dx = entity.transform.x - weapon.transform.x;
        const dy = entity.transform.y - weapon.transform.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < minDistSq) {
          minDistSq = distSq;
          nearest = candidateId;
        }
      }

      if (nearest) {
        const target = world.getEntity(Number(nearest));
        if (target?.health) {
          target.health.current = Math.max(0, target.health.current - weapon.weapon.damage);
          weapon.weapon.lastFired = time;

          if (target.health.current <= 0) {
            world.removeEntity(Number(nearest));
          }
        }
      }
    }
  }
}
