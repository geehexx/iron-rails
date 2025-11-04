import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { UPGRADES, calculateUpgradeCost, getUpgradeDisplayValue } from '../state/UpgradeDefinitions';

/**
 * UpgradeScene - Station upgrade interface
 * Displays available upgrades and allows player to spend scrap
 */
export class UpgradeScene extends Phaser.Scene {
  private gameState!: GameState;
  private scrapText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private upgradeTexts: Map<string, Phaser.GameObjects.Text> = new Map();

  constructor() {
    super('UpgradeScene');
  }

  init(data: { gameState: GameState }) {
    this.gameState = data.gameState;
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.add.rectangle(centerX, height / 2, width, height, 0x1a1a2e);

    // Header
    this.add.text(centerX, 50, '=== UPGRADE STATION ===', {
      fontSize: '48px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Scrap display
    this.scrapText = this.add.text(centerX, 110, '', {
      fontSize: '28px',
      color: '#ffaa00',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.updateScrapDisplay();

    // Level info
    this.levelText = this.add.text(centerX, 150, '', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.updateLevelDisplay();

    // Upgrades grid
    this.createUpgradeGrid();

    // Continue button
    const continueBtn = this.add.text(centerX, height - 80, '[ Continue to Next Run ]', {
      fontSize: '32px',
      color: '#00ff00',
      fontStyle: 'bold',
      backgroundColor: '#003300',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    continueBtn.on('pointerover', () => continueBtn.setColor('#00ffff'));
    continueBtn.on('pointerout', () => continueBtn.setColor('#00ff00'));
    continueBtn.on('pointerdown', () => this.startNextRun());
  }

  private createUpgradeGrid() {
    const startY = 220;
    const spacing = 90;
    const centerX = this.cameras.main.width / 2;
    const upgrades = this.gameState.getUpgrades();

    Object.entries(UPGRADES).forEach(([key, config], index) => {
      const y = startY + index * spacing;
      const currentLevel = Math.floor(upgrades[config.statKey] / config.effectPerLevel);
      const cost = calculateUpgradeCost(config, currentLevel);
      const canAfford = this.gameState.getScrap() >= cost;
      const isMaxed = currentLevel >= config.maxLevel;

      // Upgrade name and level
      const nameText = this.add.text(centerX - 300, y, 
        `${config.name} [Lv ${currentLevel}/${config.maxLevel}]`, {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold'
      });

      // Current effect
      const effectText = this.add.text(centerX - 300, y + 28, 
        getUpgradeDisplayValue(config, currentLevel), {
        fontSize: '18px',
        color: '#aaaaaa'
      });

      // Description
      this.add.text(centerX - 100, y + 14, config.description, {
        fontSize: '16px',
        color: '#999999'
      });

      // Buy button
      if (!isMaxed) {
        const btnColor = canAfford ? '#00ff00' : '#666666';
        const buyBtn = this.add.text(centerX + 250, y + 14, 
          `[${cost} Scrap]`, {
          fontSize: '20px',
          color: btnColor,
          fontStyle: 'bold',
          backgroundColor: canAfford ? '#003300' : '#333333',
          padding: { x: 12, y: 6 }
        }).setInteractive({ useHandCursor: canAfford });

        if (canAfford) {
          buyBtn.on('pointerover', () => buyBtn.setColor('#00ffff'));
          buyBtn.on('pointerout', () => buyBtn.setColor('#00ff00'));
          buyBtn.on('pointerdown', () => this.purchaseUpgrade(key, config, cost));
        }

        this.upgradeTexts.set(key, buyBtn);
      } else {
        this.add.text(centerX + 250, y + 14, '[MAXED]', {
          fontSize: '20px',
          color: '#ffaa00',
          fontStyle: 'bold'
        });
      }
    });
  }

  private purchaseUpgrade(key: string, config: typeof UPGRADES[string], cost: number) {
    if (this.gameState.purchaseUpgrade(config.statKey, config.effectPerLevel, cost)) {
      // Success - rebuild UI
      this.scene.restart({ gameState: this.gameState });
    }
  }

  private updateScrapDisplay() {
    this.scrapText.setText(`Scrap: ${this.gameState.getScrap()}`);
  }

  private updateLevelDisplay() {
    const level = this.gameState.getCurrentLevel();
    const nextDistance = this.gameState.getTargetDistance() / 1000;
    this.levelText.setText(
      `Completed Run ${level - 1} | Next Target: ${nextDistance.toFixed(1)} km`
    );
  }

  private startNextRun() {
    this.scene.start('GameScene', { gameState: this.gameState });
  }
}
