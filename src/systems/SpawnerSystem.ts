import Phaser from 'phaser';
import { World } from '../ecs/World';
import { SpatialGrid } from './SpatialGrid';

export class SpawnerSystem {
  private lastSpawn: number = 0;
  private spawnInterval: number = 2000; // ms
  private spawnX: number = 1500; // Spawn far right, outside screen
  private spawnYRange: [number, number] = [200, 520];

  update(world: World, time: number, scene: Phaser.Scene, spatialGrid: SpatialGrid): void {
    if (time - this.lastSpawn < this.spawnInterval) return;

    const train = world.getEntitiesByType('train')[0];
    const minGapX = 300; // pixels

    let y = Phaser.Math.Between(this.spawnYRange[0], this.spawnYRange[1]);
    let spawnX = this.spawnX;
    if (train?.transform) {
      // Ensure a minimum gap from the train's x position
      if (spawnX - train.transform.x < minGapX) {
        spawnX = train.transform.x + minGapX;
      }
    }

    const enemy = world.createEntity('enemy');
    enemy.transform = { x: spawnX, y, rotation: 0 };
    enemy.health = { current: 3, max: 3 };
    enemy.velocity = { vx: -30, vy: 0 };
    enemy.sprite = scene.add.rectangle(spawnX, y, 30, 30, 0x00ff00);

    spatialGrid.insert(enemy.id, spawnX, y);
    this.lastSpawn = time;
  }
}
