import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from "class-validator";
import { Dress } from "@domain/dress/dress.entity";
import { ClassValidatorFields } from "@domain/validators/class-validator-fields";

class DressRules {
  @IsUrl({}, { message: "Url da imagem deve ser válida" })
  @IsString({
    message: "Url da imagem deve ser uma string",
  })
  @IsNotEmpty({
    message: "Url da imagem não pode ser vazia",
  })
  imageUrl: string;

  @IsPositive({ message: "Preço de aluguel deve ser um número positivo" })
  @IsNumber({}, { message: "Preço de aluguel deve ser um número" })
  @IsNotEmpty({ message: "Preço de aluguel não pode ser vazio" })
  rentPrice: number;

  constructor(props: Dress) {
    this.imageUrl = props.getImageUrl();
    this.rentPrice = props.getRentPrice();
  }
}

export class DressValidator extends ClassValidatorFields<DressRules> {
  validate(entity: Dress) {
    return super.validate(new DressRules(entity));
  }
}

export class DressValidatorFactory {
  static create() {
    return new DressValidator();
  }
}
