import Phaser from 'phaser';
import { World } from '../ecs/World';
import { SpatialGrid } from '../systems/SpatialGrid';
import { SpawnerSystem } from '../systems/SpawnerSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { ScrapSystem } from '../systems/ScrapSystem';
import { GameState } from '../state/GameState';

export class GameScene extends Phaser.Scene {
  private world!: World;
  private spatialGrid!: SpatialGrid;
  private spawner!: SpawnerSystem;
  private movement!: MovementSystem;
  private combat!: CombatSystem;
  private scrapSystem!: ScrapSystem;
  private gameState!: GameState;
  private hpText!: Phaser.GameObjects.Text;
  private scrapText!: Phaser.GameObjects.Text;
  private speedText!: Phaser.GameObjects.Text;
  private enemyCountText!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private notificationText!: Phaser.GameObjects.Text;
  private enemiesKilled: number = 0;
  private distance: number = 0;
  private targetDistance: number = 5000;
  private gameOver: boolean = false;
  private isPaused: boolean = false;
  private gameSpeed: number = 1;
  private trainSpeed: number = 0;
  private trainMaxSpeed: number = 50;
  private trainAcceleration: number = 20;
  private regenAccumulator: number = 0;

  constructor() { super('GameScene'); }

  init(data?: { gameState?: GameState }) {
    this.gameState = data?.gameState || new GameState();
    this.targetDistance = this.gameState.getTargetDistance();
    this.isPaused = false;
    this.gameSpeed = 1;
    this.trainSpeed = 0;
  }

  create() {
    this.world = new World();
    this.spatialGrid = new SpatialGrid(100);
    this.spawner = new SpawnerSystem();
    this.movement = new MovementSystem();
    this.scrapSystem = new ScrapSystem();
    this.combat = new CombatSystem((enemyId, x, y) => {
      this.enemiesKilled++;
      this.scrapSystem.spawnScrap(x, y, this.world, this, this.spatialGrid);
    });

    // Create train with upgrades applied
    const upgrades = this.gameState.getUpgrades();
    const baseMaxHp = 10;
    const maxHp = baseMaxHp + upgrades.maxHp;
    this.trainMaxSpeed = 50 * (1 + upgrades.maxSpeed);
    this.trainAcceleration = 20 * (1 + upgrades.acceleration);
    
    // Apply armor to combat system
    this.combat.setArmor(upgrades.armor);
    
    const train = this.world.createEntity('train');
    train.transform = { x: 200, y: 360, rotation: 0 };
    train.health = { current: maxHp, max: maxHp };
    train.combat = { damage: 1, range: 400, fireRate: 800, lastFired: 0 };
    train.sprite = this.add.rectangle(200, 360, 100, 60, 0x3366ff);
    this.spatialGrid.insert(train.id, 200, 360);

    // HUD - styled better
    this.hpText = this.add.text(16, 16, 'HP: 10', { 
      fontSize: '28px', 
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000', 
      strokeThickness: 4 
    });
    this.scrapText = this.add.text(16, 52, 'Scrap: 0', {
      fontSize: '24px',
      color: '#ffaa00',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4
    });
    this.distanceText = this.add.text(16, 88, 'Distance: 0.0 / 5.0 km', { 
      fontSize: '24px', 
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000', 
      strokeThickness: 4 
    });
    this.speedText = this.add.text(16, 124, 'Speed: 0 km/h', {
      fontSize: '20px',
      color: '#00ffff',
      stroke: '#000',
      strokeThickness: 3
    });
    this.enemyCountText = this.add.text(16, 156, 'Enemies: 0', { 
      fontSize: '20px', 
      color: '#fff',
      stroke: '#000', 
      strokeThickness: 3 
    });
    
    // Notification area (center top)
    this.notificationText = this.add.text(640, 50, '', {
      fontSize: '24px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);

    // Keyboard controls
    this.setupKeyboardControls();
  }

  private setupKeyboardControls() {
    // P for pause
    this.input.keyboard?.on('keydown-P', () => {
      this.togglePause();
    });

    // + for speed up
    this.input.keyboard?.on('keydown-PLUS', () => {
      this.cycleGameSpeed(1);
    });
    this.input.keyboard?.on('keydown-EQUALS', () => {
      this.cycleGameSpeed(1);
    });

    // - for slow down
    this.input.keyboard?.on('keydown-MINUS', () => {
      this.cycleGameSpeed(-1);
    });
  }

  private togglePause() {
    this.isPaused = !this.isPaused;
    this.showNotification(this.isPaused ? 'PAUSED' : 'RESUMED', 1000);
  }

  private cycleGameSpeed(direction: number) {
    const speeds = [1, 2];
    let index = speeds.indexOf(this.gameSpeed);
    if (index === -1) index = 0;
    index = (index + direction + speeds.length) % speeds.length;
    const newSpeed = speeds[index];
    if (newSpeed !== undefined) {
      this.gameSpeed = newSpeed;
      this.showNotification(`Speed: ${this.gameSpeed}x`, 800);
    }
  }

  private showNotification(text: string, duration: number) {
    this.notificationText.setText(text);
    this.notificationText.setAlpha(1);
    this.tweens.add({
      targets: this.notificationText,
      alpha: 0,
      duration: duration,
      delay: duration * 0.3
    });
  }

  update(time: number, delta: number): void {
    if (this.gameOver) return;
    if (this.isPaused) return;

    const effectiveDelta = delta * this.gameSpeed;
    const deltaSeconds = effectiveDelta / 1000;

    // Update systems
    this.spawner.update(this.world, time, this, this.spatialGrid);
    this.movement.update(this.world, effectiveDelta, this.spatialGrid);
    this.combat.update(this.world, time, effectiveDelta, this.spatialGrid);
    this.scrapSystem.update(this.world, this.spatialGrid, (amount) => {
      this.gameState.addScrap(amount);
    });

    const train = this.world.getEntitiesByType('train')[0];
    if (!train?.transform || !train.health) return;

    // Train acceleration physics
    if (this.trainSpeed < this.trainMaxSpeed) {
      this.trainSpeed += this.trainAcceleration * deltaSeconds;
      this.trainSpeed = Math.min(this.trainSpeed, this.trainMaxSpeed);
    }

    // Update distance based on speed
    this.distance += this.trainSpeed * deltaSeconds;

    // Apply regeneration
    const upgrades = this.gameState.getUpgrades();
    if (upgrades.regen > 0) {
      this.regenAccumulator += deltaSeconds;
      if (this.regenAccumulator >= 1.0) {
        const regenAmount = Math.floor(this.regenAccumulator * upgrades.regen);
        if (regenAmount > 0 && train.health.current < train.health.max) {
          train.health.current = Math.min(
            train.health.current + regenAmount,
            train.health.max
          );
          this.regenAccumulator = 0;
        }
      }
    }

    // Apply armor to damage (handled in CombatSystem, but we track it here)
    // Armor reduces damage taken - this is applied when damage is dealt

    // Update HUD
    const hpPercent = train.health.current / train.health.max;
    this.hpText.setText(`HP: ${train.health.current} / ${train.health.max}`);
    this.hpText.setColor(hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000');
    this.scrapText.setText(`Scrap: ${this.gameState.getScrap()}`);
    this.distanceText.setText(
      `Distance: ${(this.distance / 1000).toFixed(1)} / ${(this.targetDistance / 1000).toFixed(1)} km`
    );
    this.speedText.setText(`Speed: ${Math.floor(this.trainSpeed)} km/h`);
    this.enemyCountText.setText(`Enemies: ${this.world.getEntitiesByType('enemy').length}`);

    // Check loss condition
    if (train.health.current <= 0) {
      this.gameOver = true;
      this.handleDefeat();
      return;
    }

    // Check win condition
    if (this.distance >= this.targetDistance) {
      this.gameOver = true;
      this.handleVictory();
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

  private handleVictory() {
    // Update stats
    this.gameState.addEnemiesKilled(this.enemiesKilled);
    this.gameState.addDistanceTraveled(this.distance);
    this.gameState.incrementLevel();
    this.gameState.save();

    // Show victory screen briefly, then transition to upgrade scene
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    this.add.rectangle(centerX, centerY, 1280, 720, 0x000000, 0.8);
    
    this.add.text(centerX, centerY - 50, 'STATION REACHED!', {
      fontSize: '56px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    const stats = `Distance: ${(this.distance / 1000).toFixed(1)} km\nEnemies Killed: ${this.enemiesKilled}\nScrap Earned: ${this.gameState.getScrap()}`;
    this.add.text(centerX, centerY + 50, stats, {
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Transition to upgrade scene after 2 seconds
    this.time.delayedCall(2000, () => {
      this.scene.start('UpgradeScene', { gameState: this.gameState });
    });
  }

  private handleDefeat() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    this.add.rectangle(centerX, centerY, 1280, 720, 0x000000, 0.8);
    
    this.add.text(centerX, centerY - 80, 'TRAIN DESTROYED', {
      fontSize: '56px',
      color: '#ff0000',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    const stats = `Distance: ${(this.distance / 1000).toFixed(1)} km\nEnemies Killed: ${this.enemiesKilled}\nScrap Lost: ${this.gameState.getScrap()}`;
    this.add.text(centerX, centerY, stats, {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Reset button
    const retryBtn = this.add.text(centerX, centerY + 100, '[ Retry from Station ]', {
      fontSize: '28px',
      color: '#ffaa00',
      fontStyle: 'bold',
      backgroundColor: '#332200',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    retryBtn.on('pointerover', () => retryBtn.setColor('#ffff00'));
    retryBtn.on('pointerout', () => retryBtn.setColor('#ffaa00'));
    retryBtn.on('pointerdown', () => {
      // Retry without losing progress
      this.scene.start('GameScene', { gameState: this.gameState });
    });
  }
}
