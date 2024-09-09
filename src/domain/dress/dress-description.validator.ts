import { IsNotEmpty, IsString } from "class-validator";
import { DressDescription } from "@domain/dress/dress-description.vo";
import { ClassValidatorFields } from "@domain/validators/class-validator-fields";

class DressDescriptionRules {
  @IsString({ message: "Modelo do vestido deve ser uma string" })
  @IsNotEmpty({ message: "Modelo do vestido não pode ser vazio" })
  model: string;

  @IsString({ message: "Cor do vestido deve ser uma string" })
  @IsNotEmpty({ message: "Cor do vestido não pode ser vazia" })
  color: string;

  @IsString({ message: "Tecido do vestido deve ser uma string" })
  @IsNotEmpty({ message: "Tecido do vestido não pode ser vazio" })
  fabric: string;

  constructor(props: DressDescription) {
    this.model = props.getModel();
    this.color = props.getColor();
    this.fabric = props.getFabric();
  }
}

export class DressDescriptionValidator extends ClassValidatorFields<DressDescriptionRules> {
  validate(entity: DressDescription) {
    return super.validate(new DressDescriptionRules(entity));
  }
}

export class DressDescriptionValidatorFactory {
  static create() {
    return new DressDescriptionValidator();
  }
}
