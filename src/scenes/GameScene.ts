import Phaser from 'phaser';
import { World } from '../ecs/World';
import { SpatialGrid } from '../systems/SpatialGrid';
import { SpawnerSystem } from '../systems/SpawnerSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { ScrapSystem } from '../systems/ScrapSystem';
import { GameState } from '../state/GameState';
import { PlayerSystem } from '../systems/PlayerSystem';
import { UISystem } from '../systems/UISystem';

export class GameScene extends Phaser.Scene {
  private world!: World;
  private spatialGrid!: SpatialGrid;
  private spawner!: SpawnerSystem;
  private movement!: MovementSystem;
  private combat!: CombatSystem;
  private scrapSystem!: ScrapSystem;
  private playerSystem!: PlayerSystem;
  private uiSystem!: UISystem;
  private gameState!: GameState;
  private enemiesKilled: number = 0;
  private distance: number = 0;
  private targetDistance: number = 5000;
  private gameOver: boolean = false;
  private isPaused: boolean = false;
  private gameSpeed: number = 1;

  constructor() { super('GameScene'); }

  init(data?: { gameState?: GameState }) {
    this.gameState = data?.gameState || new GameState();
    this.targetDistance = this.gameState.getTargetDistance();
    this.isPaused = false;
    this.gameSpeed = 1;
    this.distance = 0;
    this.enemiesKilled = 0;
    this.gameOver = false;
  }

  create() {
    this.world = new World();
    this.spatialGrid = new SpatialGrid(100);
    this.spawner = new SpawnerSystem();
    this.movement = new MovementSystem();
    this.scrapSystem = new ScrapSystem();
    this.playerSystem = new PlayerSystem();
    this.uiSystem = new UISystem(this);
    this.combat = new CombatSystem((enemyId, x, y) => {
      this.enemiesKilled++;
      this.scrapSystem.spawnScrap(x, y, this.world, this, this.spatialGrid);
    });

    // Create train with upgrades applied
    const upgrades = this.gameState.getUpgrades();
    const baseMaxHp = 10;
    const maxHp = baseMaxHp + upgrades.maxHp;
    
    // Apply armor to combat system
    this.combat.setArmor(upgrades.armor);
    
    const train = this.world.createEntity('train');
    train.transform = { x: 200, y: 360, rotation: 0 };
    train.health = { current: maxHp, max: maxHp };
    train.combat = { damage: 1, range: 400, fireRate: 800, lastFired: 0 };
    train.velocity = { vx: 0, vy: 0 };
    train.sprite = this.add.rectangle(200, 360, 100, 60, 0x3366ff);
    this.spatialGrid.insert(train.id, 200, 360);

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
    // Pause/resume timers and tweens to fully freeze the simulation
    if (this.isPaused) {
      this.time.timeScale = 0;
      this.tweens.timeScale = 0;
    } else {
      this.time.timeScale = 1;
      this.tweens.timeScale = 1;
    }
    this.uiSystem.showNotification(this.isPaused ? 'PAUSED' : 'RESUMED', 1000);
  }

  private cycleGameSpeed(direction: number) {
    const speeds = [1, 2];
    let index = speeds.indexOf(this.gameSpeed);
    if (index === -1) index = 0;
    index = (index + direction + speeds.length) % speeds.length;
    const newSpeed = speeds[index];
    if (newSpeed !== undefined) {
      this.gameSpeed = newSpeed;
      this.uiSystem.showNotification(`Speed: ${this.gameSpeed}x`, 800);
    }
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
    this.playerSystem.update(this.world, this.gameState, effectiveDelta);
    this.scrapSystem.update(this.world, this.spatialGrid, (amount) => {
      this.gameState.addScrap(amount);
    });

    const train = this.world.getEntitiesByType('train')[0];
    if (!train?.transform || !train.health || !train.velocity) return;

    // Update distance based on speed
    this.distance += train.velocity.vx * deltaSeconds;

    // Update UI
    this.uiSystem.update(this.world, this.gameState, this.distance, this.targetDistance, train.velocity.vx);

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
