import { BookingDressItem } from "./booking-dress-item.entity";
import { ClassValidatorFields } from "@core/@shared/domain/validators/class-validator-fields";
import { INotification } from "@core/@shared/domain/validators/notification.interface";
import { IsUUID } from "class-validator";

class BookingItemRules {
  @IsUUID("4", { message: "Id do produto inválido", groups: ["productId"] })
  productId: string;

  constructor(aggregate: BookingDressItem) {
    Object.assign(this, aggregate);
  }
}

export class BookingItemValidator extends ClassValidatorFields {
  validate(notification: INotification, data: any, fields?: string[]): void {
    const newFields = fields?.length ? fields : Object.keys(data);

    return super.validate(notification, new BookingItemRules(data), newFields);
  }
}

export class BookingItemValidatorFactory {
  static create() {
    return new BookingItemValidator();
  }
}
