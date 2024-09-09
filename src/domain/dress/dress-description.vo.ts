import { ValueObject } from "@domain/@shared/value-object";
import { DressDescriptionValidatorFactory } from "@domain/dress/dress-description.validator";
import { ValueObjectValidationError } from "@domain/validators/validation.error";

export class DressDescription extends ValueObject {
  private readonly color: string;
  private readonly model: string;
  private readonly fabric: string;

  constructor({
    color,
    model,
    fabric,
  }: {
    color: string;
    model: string;
    fabric: string;
  }) {
    super();

    this.color = color;
    this.model = model;
    this.fabric = fabric;

    DressDescription.validate(this);
  }

  static validate(vo: DressDescription): void {
    const validator = DressDescriptionValidatorFactory.create();
    const isValid = validator.validate(vo);

    if (!isValid) {
      throw new ValueObjectValidationError(validator.errors);
    }
  }

  getColor(): string {
    return this.color;
  }

  getModel(): string {
    return this.model;
  }

  getFabric(): string {
    return this.fabric;
  }

  toString(): string {
    return `${this.color}, ${this.model}, ${this.fabric}`;
  }
}
