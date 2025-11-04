import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { World } from '../ecs/World';

export class UISystem {
  private hpText!: Phaser.GameObjects.Text;
  private scrapText!: Phaser.GameObjects.Text;
  private speedText!: Phaser.GameObjects.Text;
  private enemyCountText!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private notificationText!: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    // HUD - styled better
    this.hpText = this.scene.add.text(16, 16, 'HP: 10', {
        fontSize: '28px',
        color: '#00ff00',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
      });
      this.scrapText = this.scene.add.text(16, 52, 'Scrap: 0', {
        fontSize: '24px',
        color: '#ffaa00',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
      });
      this.distanceText = this.scene.add.text(16, 88, 'Distance: 0.0 / 5.0 km', {
        fontSize: '24px',
        color: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
      });
      this.speedText = this.scene.add.text(16, 124, 'Speed: 0 km/h', {
        fontSize: '20px',
        color: '#00ffff',
        stroke: '#000',
        strokeThickness: 3
      });
      this.enemyCountText = this.scene.add.text(16, 156, 'Enemies: 0', {
        fontSize: '20px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 3
      });

      // Notification area (center top)
      this.notificationText = this.scene.add.text(640, 50, '', {
        fontSize: '24px',
        color: '#00ff00',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0);
  }

  update(world: World, gameState: GameState, distance: number, targetDistance: number, trainSpeed: number) {
    const train = world.getEntitiesByType('train')[0];
    if (!train?.health) return;

    // Update HUD
    const hpPercent = train.health.current / train.health.max;
    this.hpText.setText(`HP: ${train.health.current} / ${train.health.max}`);
    this.hpText.setColor(hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000');
    this.scrapText.setText(`Scrap: ${gameState.getScrap()}`);
    this.distanceText.setText(
      `Distance: ${(distance / 1000).toFixed(1)} / ${(targetDistance / 1000).toFixed(1)} km`
    );
    this.speedText.setText(`Speed: ${Math.floor(trainSpeed)} km/h`);
    this.enemyCountText.setText(`Enemies: ${world.getEntitiesByType('enemy').length}`);
  }

  showNotification(text: string, duration: number) {
    this.notificationText.setText(text);
    this.notificationText.setAlpha(1);
    this.scene.tweens.add({
      targets: this.notificationText,
      alpha: 0,
      duration: duration,
      delay: duration * 0.3
    });
  }
}
