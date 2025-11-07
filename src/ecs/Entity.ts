import Phaser from 'phaser';

export type EntityId = number;

export interface Entity {
  id: EntityId;
  transform?: import('../components/Transform').Transform;
  health?: import('../components/Health').Health;
  combat?: import('../components/Combat').Combat;
  velocity?: import('../components/Velocity').Velocity;
  scrap?: import('../components/Scrap').Scrap;
  sprite?: Phaser.GameObjects.GameObject;
  trainCar?: import('../components/TrainCar').TrainCar;
  weapon?: import('../components/Weapon').Weapon;
  hardpoint?: import('../components/Hardpoint').Hardpoint;
  explosion?: import('../components/Explosion').Explosion;
  type: 'train' | 'train-car' | 'weapon' | 'enemy' | 'projectile' | 'scrap';
}
