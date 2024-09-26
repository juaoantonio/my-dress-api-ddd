import { Entity } from "../../../domain/entity";
import { ValueObject } from "../../../domain/value-object";

export interface IModelMapper<E extends Entity<any> | ValueObject, M> {
  toModel(entity: E): M;

  toEntity(model: M): E;
}
