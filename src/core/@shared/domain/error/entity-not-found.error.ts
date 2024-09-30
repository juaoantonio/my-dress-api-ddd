import { Entity } from "../entity";
import { Identifier } from "../identifier";

export class EntityNotFoundError extends Error {
  constructor(
    id: Identifier[] | Identifier,
    entityClass: new (...args: any[]) => Entity<Identifier>,
  ) {
    const idsMessage = Array.isArray(id) ? id.join(", ") : id;
    super(`${entityClass.name} with id(s) ${idsMessage} not found`);
    this.name = "EntityNotFoundError";
  }
}
