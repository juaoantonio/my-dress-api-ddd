import { ValueObject } from "@domain/@shared/value-object";

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

    this.validate();
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

  validate(): void {
    if (!this.color) throw new Error("Cor do vestido não pode ser vazia");
    if (!this.model) throw new Error("Modelo do vestido não pode ser vazio");
    if (!this.fabric) throw new Error("Tecido do vestido não pode ser vazio");
  }

  toString(): string {
    return `${this.color}, ${this.model}, ${this.fabric}`;
  }
}
