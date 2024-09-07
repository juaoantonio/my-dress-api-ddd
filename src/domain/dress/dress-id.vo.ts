import { Uuid } from "@domain/@shared/value-objects/uuid.vo";

export class DressId extends Uuid {
  constructor(value: string) {
    super(value);
  }
}
