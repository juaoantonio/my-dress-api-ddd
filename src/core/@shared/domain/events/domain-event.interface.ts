import { Identifier } from "../identifier";

export interface IDomainEvent {
  aggregateId: Identifier;
  occurredOn: Date;
}
