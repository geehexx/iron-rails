import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  preload() { /* Load assets */ }
  create() { this.scene.start('GameScene'); }
}
