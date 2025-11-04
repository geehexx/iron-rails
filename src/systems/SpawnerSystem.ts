import Phaser from 'phaser';
import { World } from '../ecs/World';

export class SpawnerSystem {
  private lastSpawn: number = 0;
  private spawnInterval: number = 2000; // ms
  private spawnX: number = 1500; // Spawn far right, outside screen
  private spawnYRange: [number, number] = [200, 520];

  update(world: World, time: number, scene: Phaser.Scene): void {
    if (time - this.lastSpawn < this.spawnInterval) return;
    
    const enemy = world.createEntity('enemy');
    const y = Phaser.Math.Between(this.spawnYRange[0], this.spawnYRange[1]);
    
    enemy.transform = { x: this.spawnX, y, rotation: 0 };
    enemy.health = { current: 3, max: 3 }; // 3 HP so they survive longer
    enemy.velocity = { vx: -30, vy: 0 }; // Slower movement
    enemy.sprite = scene.add.rectangle(this.spawnX, y, 30, 30, 0x00ff00);
    
    this.lastSpawn = time;
  }
}
