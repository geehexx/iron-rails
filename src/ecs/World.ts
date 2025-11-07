import { Entity, EntityId } from './Entity';

export class World {
  private nextId: EntityId = 1;
  public entities: Map<EntityId, Entity> = new Map();

  createEntity(type: Entity['type']): Entity {
    const entity: Entity = { id: this.nextId++, type };
    this.entities.set(entity.id, entity);
    return entity;
  }

  getEntity(id: EntityId): Entity | undefined {
    return this.entities.get(id);
  }

  removeEntity(id: EntityId): boolean {
    const entity = this.entities.get(id);
    if (!entity) return false;
    if (entity.sprite) entity.sprite.destroy();
    this.entities.delete(id);
    return true;
  }

  destroyEntity(id: EntityId): void {
    this.removeEntity(id);
  }

  getEntitiesByType(type: Entity['type']): Entity[] {
    return Array.from(this.entities.values()).filter(e => e.type === type);
  }

  clear(): void {
    const ids = Array.from(this.entities.keys());
    for (const id of ids) {
      this.destroyEntity(id);
    }
  }
}
