import { EntityId } from '../ecs/Entity';

export interface Hardpoint {
  weaponId: EntityId | null;
  offsetX: number;
  offsetY: number;
}
