import { Identifier } from "@domain/@shared/identifier";
import { INotification } from "@domain/validators/notification.interface";
import { NotificationImplementation } from "@domain/validators/notification-implementation";

export abstract class Entity<ID extends Identifier> {
  public readonly notification: INotification =
    new NotificationImplementation();
  private readonly id: ID;

  protected constructor(id: ID) {
    this.id = id;
  }

  public getId(): ID {
    return this.id;
  }

  public equals(entity: Entity<ID>): boolean {
    return this.id.equals(entity.id);
  }
}
