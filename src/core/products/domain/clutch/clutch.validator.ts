import { IsNotEmpty, IsPositive, IsString, IsUrl } from "class-validator";
import { Clutch } from "./clutch.aggregate-root";
import { ClassValidatorFields } from "@core/@shared/domain/validators/class-validator-fields";
import { INotification } from "@core/@shared/domain/validators/notification.interface";

class ClutchRules {
  @IsUrl({}, { message: "Url da imagem deve ser válida", groups: ["imageUrl"] })
  @IsNotEmpty({
    message: "Url da imagem não pode ser vazia",
    groups: ["imageUrl"],
  })
  imageUrl: string;

  @IsPositive({
    message: "Preço de aluguel deve ser positivo",
    groups: ["rentPrice"],
  })
  rentPrice: number;

  @IsString({ message: "Modelo deve ser uma string", groups: ["model"] })
  @IsNotEmpty({ message: "Modelo não pode ser vazio", groups: ["model"] })
  model: string;

  @IsString({ message: "Cor deve ser uma string", groups: ["color"] })
  @IsNotEmpty({ message: "Cor não pode ser vazia", groups: ["color"] })
  color: string;

  constructor(aggregate: Clutch) {
    Object.assign(this, aggregate);
  }
}

export class ClutchValidator extends ClassValidatorFields {
  validate(notification: INotification, data: any, fields?: string[]): void {
    const newFields = fields?.length ? fields : Object.keys(data);

    return super.validate(notification, new ClutchRules(data), newFields);
  }
}

export class ClutchValidatorFactory {
  static create() {
    return new ClutchValidator();
  }
}
