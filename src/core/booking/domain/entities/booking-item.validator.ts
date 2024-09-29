import { BookingItem } from "./booking-item.entity";
import { ClassValidatorFields } from "../../../@shared/domain/validators/class-validator-fields";
import { INotification } from "../../../@shared/domain/validators/notification.interface";
import { IsEnum, IsUUID } from "class-validator";
import { ValidateObjectFields } from "@core/@shared/domain/custom-decorators/custom-class-validator-decorators";

class BookingItemRules {
  @IsUUID("4", { message: "Id do produto inválido", groups: ["productId"] })
  productId: string;

  @ValidateObjectFields((o) => o.type === "dress", {
    groups: ["adjustments"],
    message: "Somente vestidos podem ter ajustes",
  })
  adjustments: any[];

  @IsEnum(["dress", "clutch"], {
    message: "Tipo de produto inválido",
    groups: ["type"],
  })
  type: "dress" | "clutch";

  constructor(aggregate: BookingItem) {
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
