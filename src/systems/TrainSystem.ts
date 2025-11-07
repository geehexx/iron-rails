import { World } from '../ecs/World';
import { EntityId } from '../ecs/Entity';

export class TrainSystem {
  private trainCarIds: EntityId[] = [];
  private readonly carSpacing = 50;

  setTrainComposition(carIds: EntityId[]): void {
    this.trainCarIds = [...carIds];
  }

  getTrainComposition(): EntityId[] {
    return [...this.trainCarIds];
  }

  update(world: World): void {
    if (this.trainCarIds.length === 0) return;

    const engine = world.getEntity(this.trainCarIds[0]);
    if (!engine?.transform || !engine.velocity) return;

    for (let i = 1; i < this.trainCarIds.length; i++) {
      const car = world.getEntity(this.trainCarIds[i]);
      if (!car?.transform) continue;

      car.transform.x = engine.transform.x - i * this.carSpacing;
      car.transform.y = engine.transform.y;
    }
  }

  routeDamage(world: World, damage: number): void {
    if (damage <= 0 || this.trainCarIds.length === 0) return;

    for (let i = this.trainCarIds.length - 1; i >= 0 && damage > 0; i--) {
      const carId = this.trainCarIds[i];
      const car = world.getEntity(carId);
      if (!car?.health) continue;

      const remaining = car.health.current - damage;
      if (remaining > 0) {
        car.health.current = remaining;
        damage = 0;
      } else {
        damage = -remaining;
        this.destroyCar(world, carId);
      }
    }
  }

  private destroyCar(world: World, carId: EntityId): void {
    const index = this.trainCarIds.indexOf(carId);
    if (index === -1) return;

    this.trainCarIds.splice(index, 1);
    world.removeEntity(carId);
  }

  isEngineDestroyed(world: World): boolean {
    if (this.trainCarIds.length === 0) return true;
    const engineId = this.trainCarIds[0];
    const engine = world.getEntity(engineId);
    if (!engine) return true;
    return engine.health ? engine.health.current <= 0 : false;
  }

  getTotalHealth(world: World): { current: number; max: number } {
    let current = 0;
    let max = 0;

    for (const carId of this.trainCarIds) {
      const car = world.getEntity(carId);
      if (car?.health) {
        current += car.health.current;
        max += car.health.max;
      }
    }

    return { current, max };
  }
}
