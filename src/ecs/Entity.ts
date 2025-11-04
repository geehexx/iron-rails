import Phaser from 'phaser';

export type EntityId = number;

export interface Entity {
  id: EntityId;
  transform?: import('../components/Transform').Transform;
  health?: import('../components/Health').Health;
  combat?: import('../components/Combat').Combat;
  velocity?: import('../components/Velocity').Velocity;
  sprite?: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle;
  type: 'train' | 'enemy' | 'projectile';
}
