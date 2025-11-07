import Phaser from 'phaser';

export function createHeadlessGame(sceneConfig: Phaser.Types.Scenes.SettingsConfig) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.HEADLESS,
    width: 800,
    height: 600,
    scene: sceneConfig,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    audio: {
      noAudio: true,
    },
  };

  return new Phaser.Game(config);
}

export function destroyGame(game: Phaser.Game) {
  game.destroy(true);
}
