import { Entity, EntityId } from './Entity';

export class World {
  private nextId: EntityId = 1;
  public entities: Map<EntityId, Entity> = new Map();

  createEntity(type: Entity['type']): Entity {
    const entity: Entity = { id: this.nextId++, type };
    this.entities.set(entity.id, entity);
    return entity;
  }

  destroyEntity(id: EntityId): void {
    const entity = this.entities.get(id);
    if (entity?.sprite) entity.sprite.destroy();
    this.entities.delete(id);
  }

  getEntitiesByType(type: Entity['type']): Entity[] {
    return Array.from(this.entities.values()).filter(e => e.type === type);
  }

  clear(): void {
    this.entities.forEach((e, id) => this.destroyEntity(id));
  }
}
