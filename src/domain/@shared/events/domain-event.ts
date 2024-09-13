import { Identifier } from "@domain/@shared/identifier";

export interface IDomainEvent {
  aggregateId: Identifier;
  occurredOn: Date;
}
