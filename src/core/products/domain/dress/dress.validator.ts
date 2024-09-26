import { IsNotEmpty, IsPositive, IsUrl } from "class-validator";
import { Dress } from "./dress.aggregate";
import { ClassValidatorFields } from "../../../@shared/domain/validators/class-validator-fields";
import { INotification } from "../../../@shared/domain/validators/notification.interface";

class DressRules {
  @IsUrl({}, { message: "Url da imagem deve ser válida", groups: ["imageUrl"] })
  imageUrl: string;

  @IsPositive({
    message: "Preço de aluguel deve ser positivo",
    groups: ["rentPrice"],
  })
  rentPrice: number;

  @IsNotEmpty({
    message: "Modelo não pode ser vazio",
    groups: ["model"],
  })
  model: string;

  @IsNotEmpty({
    message: "Cor não pode ser vazia",
    groups: ["color"],
  })
  color: string;

  @IsNotEmpty({
    message: "Tecido não pode ser vazio",
    groups: ["fabric"],
  })
  fabric: string;

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
