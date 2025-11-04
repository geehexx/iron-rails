import Phaser from 'phaser';
import { World } from '../ecs/World';
import { SpatialGrid } from '../systems/SpatialGrid';
import { SpawnerSystem } from '../systems/SpawnerSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { CombatSystem } from '../systems/CombatSystem';

export class GameScene extends Phaser.Scene {
  private world!: World;
  private spatialGrid!: SpatialGrid;
  private spawner!: SpawnerSystem;
  private movement!: MovementSystem;
  private combat!: CombatSystem;
  private hpText!: Phaser.GameObjects.Text;
  private enemyCountText!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private enemiesKilled: number = 0;
  private distance: number = 0;
  private targetDistance: number = 5000; // 5km to win
  private gameOver: boolean = false;

  constructor() { super('GameScene'); }

  create() {
    this.world = new World();
    this.spatialGrid = new SpatialGrid(100);
    this.spawner = new SpawnerSystem();
    this.movement = new MovementSystem();
    this.combat = new CombatSystem((enemyId) => {
      this.enemiesKilled++;
    });

    // Create train (larger, more visible)
    const train = this.world.createEntity('train');
    train.transform = { x: 200, y: 360, rotation: 0 };
    train.health = { current: 10, max: 10 };
    train.combat = { damage: 1, range: 400, fireRate: 800, lastFired: 0 }; // Longer range, faster fire
    train.sprite = this.add.rectangle(200, 360, 100, 60, 0x3366ff); // Larger, nicer blue
    this.spatialGrid.insert(train.id, 200, 360);

    // HUD - styled better
    this.hpText = this.add.text(16, 16, 'HP: 10', { 
      fontSize: '28px', 
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000', 
      strokeThickness: 4 
    });
    this.distanceText = this.add.text(16, 52, 'Distance: 0.0 / 5.0 km', { 
      fontSize: '24px', 
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000', 
      strokeThickness: 4 
    });
    this.enemyCountText = this.add.text(16, 88, 'Enemies: 0', { 
      fontSize: '20px', 
      color: '#fff',
      stroke: '#000', 
      strokeThickness: 3 
    });
  }

  update(time: number, delta: number): void {
    if (this.gameOver) return;

    this.spawner.update(this.world, time, this);
    this.movement.update(this.world, delta, this.spatialGrid);
    this.combat.update(this.world, time, delta, this.spatialGrid);

    // Update distance (simulate forward movement)
    this.distance += delta * 0.05; // 50 meters per second

    // Update HUD
    const train = this.world.getEntitiesByType('train')[0];
    if (train?.health) {
      this.hpText.setText(`HP: ${train.health.current}`);
      this.hpText.setColor(train.health.current > 5 ? '#00ff00' : '#ff0000');
      
      // Check loss condition
      if (train.health.current <= 0) {
        this.gameOver = true;
        this.showGameOver('DEFEAT - Train Destroyed!');
        return;
      }
    }
    
    this.distanceText.setText(`Distance: ${(this.distance / 1000).toFixed(1)} / 5.0 km`);
    this.enemyCountText.setText(`Enemies: ${this.world.getEntitiesByType('enemy').length}`);

    // Check win condition
    if (this.distance >= this.targetDistance) {
      this.gameOver = true;
      this.showGameOver('VICTORY - Station Reached!');
      return;
    }

    // Cleanup off-screen enemies (left side)
    this.world.getEntitiesByType('enemy').forEach(e => {
      if (e.transform && e.transform.x < -50) {
        this.spatialGrid.remove(e.id);
        this.world.destroyEntity(e.id);
      }
    });
  }

  private showGameOver(message: string) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    // Background overlay
    this.add.rectangle(centerX, centerY, 1280, 720, 0x000000, 0.7);
    
    // Game over text
    this.add.text(centerX, centerY - 50, message, {
      fontSize: '48px',
      color: message.includes('VICTORY') ? '#00ff00' : '#ff0000',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Stats
    const stats = `Distance: ${(this.distance / 1000).toFixed(1)} km\nEnemies Killed: ${this.enemiesKilled}`;
    this.add.text(centerX, centerY + 50, stats, {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);
  }
}
