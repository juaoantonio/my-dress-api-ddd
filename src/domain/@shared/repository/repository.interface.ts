import { Entity } from "@domain/@shared/entity";
import { Identifier } from "@domain/@shared/identifier";

export interface IRepository<
  EntityId extends Identifier,
  E extends Entity<EntityId>,
> {
  save(entity: E): Promise<void>;
  saveMany(entities: E[]): Promise<void>;
  findById(entityId: EntityId): Promise<E | null>;
  findMany(): Promise<E[]>;
  findManyByIds(entityIds: EntityId[]): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(entityId: EntityId): Promise<void>;
  deleteManyByIds(entityIds: EntityId[]): Promise<void>;
  existsById(
    entityIds: EntityId[],
  ): Promise<{ exists: EntityId[]; notExists: EntityId[] }>;
}
