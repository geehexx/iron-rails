import { EntityId } from '../ecs/Entity';

export type CarType = 'engine' | 'gun' | 'cargo';

export interface TrainCar {
  carType: CarType;
  position: number;
  hardpoints?: EntityId[];
}
