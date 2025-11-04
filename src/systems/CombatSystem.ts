import { World } from '../ecs/World';
import { SpatialGrid } from './SpatialGrid';
import { EntityId } from '../ecs/Entity';

export class CombatSystem {
  private readonly EXPLOSION_RADIUS = 80; // AOE radius for zombie explosion
  private readonly EXPLOSION_DAMAGE = 1; // Flat damage to train if in range
  private armorMultiplier: number = 1.0;

  constructor(
    private onEnemyKilled?: (enemyId: EntityId, x: number, y: number) => void
  ) {}

  /**
   * Set armor damage reduction.
   * @param armorValue - Armor value between 0.0 (no reduction) and 1.0 (100% reduction, immune).
   *                     Values > 1.0 are capped at full immunity.
   */
  setArmor(armorValue: number): void {
    if (armorValue < 0) {
      console.warn(`CombatSystem.setArmor: negative armorValue ${armorValue} clamped to 0`);
      armorValue = 0;
    }
    this.armorMultiplier = Math.max(0, 1.0 - Math.min(armorValue, 1.0));
  }

  private explodeEnemy(x: number, y: number, world: World): void {
    // Check if train is within explosion radius
    const train = world.getEntitiesByType('train')[0];
    if (!train?.transform || !train.health) return;

    const dx = train.transform.x - x;
    const dy = train.transform.y - y;
    const distSq = dx * dx + dy * dy;
    if (distSq <= this.EXPLOSION_RADIUS * this.EXPLOSION_RADIUS) {
      const damage = Math.ceil(this.EXPLOSION_DAMAGE * this.armorMultiplier);
      train.health.current -= damage;
    }
  }

  private findNearestEnemy(
    x: number, y: number, range: number, 
    spatialGrid: SpatialGrid, world: World
  ): EntityId | null {
    const candidates = spatialGrid.queryRadius(x, y, range);
    let nearest: EntityId | null = null;
    let minDistSq = range * range; // Use squared distance to avoid Math.sqrt

    for (const id of candidates) {
      const entity = world.entities.get(id);
      if (!entity || entity.type !== 'enemy' || !entity.transform) continue;
      
      const dx = entity.transform.x - x;
      const dy = entity.transform.y - y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < minDistSq) {
        minDistSq = distSq;
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
          const { x, y } = enemy.transform;
          this.explodeEnemy(x, y, world);
          this.onEnemyKilled?.(targetId, x, y);
          world.destroyEntity(targetId);
          spatialGrid.remove(targetId);
        }
      }
      train.combat.lastFired = time;
    }
  }
}
