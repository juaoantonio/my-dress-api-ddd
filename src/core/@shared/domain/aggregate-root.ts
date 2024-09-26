import { Identifier } from "./identifier";
import { Entity } from "./entity";
import EventEmitter2 from "eventemitter2";
import { IDomainEvent } from "./events/domain-event.interface";

export abstract class AggregateRoot<ID extends Identifier> extends Entity<ID> {
  public events: Set<IDomainEvent> = new Set<IDomainEvent>();
  private readonly localMediator = new EventEmitter2();

  constructor(id: ID) {
    super(id);
  }

  public applyEvent(event: IDomainEvent) {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  public registerHandler(
    event: string,
    handler: (event: IDomainEvent) => void,
  ) {
    this.localMediator.on(event, handler);
  }
}
