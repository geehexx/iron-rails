import { World } from '../ecs/World';
import { SpatialGrid } from './SpatialGrid';
import { Entity } from '../ecs/Entity';
import Phaser from 'phaser';

/**
 * ScrapSystem - Handles scrap spawning, collection, and lifecycle
 */
export class ScrapSystem {
  private readonly COLLECTION_RADIUS = 150; // Auto-collect radius around train
  private readonly SCRAP_LIFETIME = 10000;  // Scrap disappears after 10 seconds
  private readonly SCRAP_VALUE = 1;         // Base scrap value per drop

  /**
   * Spawn scrap at enemy death location
   */
  spawnScrap(
    x: number, 
    y: number, 
    world: World, 
    scene: Phaser.Scene,
    spatialGrid: SpatialGrid
  ): void {
    const scrap = world.createEntity('scrap');
    scrap.transform = { x, y, rotation: 0 };
    scrap.scrap = { value: this.SCRAP_VALUE };
    
    // Create visual representation
    const circle = scene.add.circle(x, y, 8, 0xffaa00);
    circle.setStrokeStyle(2, 0xffff00);
    scrap.sprite = circle;
    
    spatialGrid.insert(scrap.id, x, y);

    // Auto-destroy after lifetime
    scene.time.delayedCall(this.SCRAP_LIFETIME, () => {
      if (world.entities.has(scrap.id)) {
        spatialGrid.remove(scrap.id);
        world.destroyEntity(scrap.id);
      }
    });
  }

  /**
   * Update scrap collection logic
   */
  update(
    world: World, 
    spatialGrid: SpatialGrid,
    onScrapCollected: (amount: number) => void
  ): void {
    const train = world.getEntitiesByType('train')[0];
    if (!train?.transform) return;

    // Find nearby scrap
    const nearbyEntities = spatialGrid.queryRadius(
      train.transform.x, 
      train.transform.y, 
      this.COLLECTION_RADIUS
    );

    for (const entityId of nearbyEntities) {
      const entity = world.entities.get(entityId);
      if (!entity || entity.type !== 'scrap' || !entity.scrap) continue;

      // Collect scrap
      onScrapCollected(entity.scrap.value);
      spatialGrid.remove(entityId);
      world.destroyEntity(entityId);
    }
  }
}
