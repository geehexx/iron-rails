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
    if (this.trainCarIds.length === 0) return;

    const rearCarId = this.trainCarIds[this.trainCarIds.length - 1];
    const rearCar = world.getEntity(rearCarId);
    
    if (!rearCar?.health) return;

    rearCar.health.current -= damage;

    if (rearCar.health.current <= 0) {
      this.destroyCar(world, rearCarId);
    }
  }

  private destroyCar(world: World, carId: EntityId): void {
    const index = this.trainCarIds.indexOf(carId);
    if (index === -1) return;

    this.trainCarIds.splice(index, 1);
    world.removeEntity(carId);
  }

  isEngineDestroyed(): boolean {
    return this.trainCarIds.length === 0;
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
