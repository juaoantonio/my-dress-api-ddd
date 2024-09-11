import { ValueObject } from "@domain/@shared/value-object";
import { InvalidDressDescriptionError } from "@domain/dress/dress.errors";

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
  }

  validate(): void {
    const isValid = [this.color, this.model, this.fabric].every(
      (value) => value.length > 0,
    );

    if (!isValid) throw new InvalidDressDescriptionError();
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
