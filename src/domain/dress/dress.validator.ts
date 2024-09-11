import { IsPositive, IsUrl } from "class-validator";
import { Dress } from "@domain/dress/dress.entity";
import { ClassValidatorFields } from "@domain/validators/class-validator-fields";
import { INotification } from "@domain/validators/notification.interface";

class DressRules {
  @IsUrl({}, { message: "Url da imagem deve ser válida", groups: ["imageUrl"] })
  imageUrl: string;

  @IsPositive({
    message: "Preço de aluguel deve ser positivo",
    groups: ["rentPrice"],
  })
  rentPrice: number;

  constructor(aggregate: Dress) {
    Object.assign(this, aggregate);
  }
}

export class DressValidator extends ClassValidatorFields {
  validate(notification: INotification, data: any, fields?: string[]): void {
    const newFields = fields?.length ? fields : Object.keys(data);

    return super.validate(notification, new DressRules(data), newFields);
  }
}

export class DressValidatorFactory {
  static create() {
    return new DressValidator();
  }
}
