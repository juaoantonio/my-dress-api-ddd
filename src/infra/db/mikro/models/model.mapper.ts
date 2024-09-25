import { Entity } from "@domain/@shared/entity";
import { ValueObject } from "@domain/@shared/value-object";

export interface ModelMapper<E extends Entity<any> | ValueObject, M> {
  toModel(entity: E): M;

  toEntity(model: M): E;
}
