import { Entity } from "@domain/@shared/entity";
import { Identifier } from "@domain/@shared/identifier";

export class EntityNotFoundError extends Error {
  constructor(
    id: any[] | any,
    entityClass: new (...args: any[]) => Entity<Identifier>,
  ) {
    const idsMessage = Array.isArray(id) ? id.join(", ") : id;
    super(`${entityClass.name} with id(s) ${idsMessage} not found`);
    this.name = "EntityNotFoundError";
  }
}
