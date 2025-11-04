import { World } from '../ecs/World';
import { GameState } from '../state/GameState';

export class PlayerSystem {
  private regenAccumulator: number = 0;

  update(world: World, gameState: GameState, delta: number) {
    const deltaSeconds = delta / 1000;
    const train = world.getEntitiesByType('train')[0];
    if (!train || !train.transform || !train.health) return;

    // Train acceleration physics
    if (train.velocity && train.combat) {
        const upgrades = gameState.getUpgrades();
        const trainMaxSpeed = 50 * (1 + upgrades.maxSpeed);
        const trainAcceleration = 20 * (1 + upgrades.acceleration);

        if (train.velocity.vx < trainMaxSpeed) {
            train.velocity.vx += trainAcceleration * deltaSeconds;
            train.velocity.vx = Math.min(train.velocity.vx, trainMaxSpeed);
        }
    }

    // Apply regeneration
    const upgrades = gameState.getUpgrades();
    if (upgrades.regen > 0) {
      this.regenAccumulator += upgrades.regen * deltaSeconds;
      if (this.regenAccumulator >= 1.0) {
        const regenAmount = Math.floor(this.regenAccumulator);
        if (regenAmount > 0 && train.health.current < train.health.max) {
          train.health.current = Math.min(
            train.health.current + regenAmount,
            train.health.max
          );
        }
        this.regenAccumulator -= regenAmount;
      }
    }
  }
}
