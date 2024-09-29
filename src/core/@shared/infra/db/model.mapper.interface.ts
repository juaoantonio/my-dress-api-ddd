import { Entity } from "../../domain/entity";
import { ValueObject } from "../../domain/value-object";
import { Identifier } from "@core/@shared/domain/identifier";

export interface IModelMapper<E extends Entity<Identifier> | ValueObject, M> {
  toModel(entity: E): M;

  toEntity(model: M): E;
}
