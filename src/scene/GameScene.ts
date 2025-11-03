import Phaser from 'phaser'
import { defineComponent, Types, addEntity, addComponent, createWorld, IWorld } from 'bitecs'

const Position = defineComponent({ x: Types.f32, y: Types.f32 })

export class GameScene extends Phaser.Scene {
  private world!: IWorld

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    // Assets will be loaded here
  }

  create() {
    this.world = createWorld()

    // Example of creating an entity with a position component
    const eid = addEntity(this.world)
    addComponent(this.world, Position, eid)
    Position.x[eid] = this.cameras.main.width / 2
    Position.y[eid] = this.cameras.main.height / 2
  }

  update(time: number, dt: number) {
    // Game loop will update ECS systems here
  }
}
