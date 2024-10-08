import { Identifier } from "../identifier";
import { v4 as uuidv4, validate as validateUuid } from "uuid";

export class Uuid extends Identifier {
  readonly value: string;

  constructor(value?: string) {
    super();
    this.value = value || uuidv4();
    this.validate();
  }

  public static create<T extends Uuid>(
    this: new (value: string) => T,
    value: string,
  ): T {
    return new this(value);
  }

  public static random<T extends Uuid>(this: new () => T): T {
    return new this();
  }

  public getValue(): string {
    return this.value;
  }

  private validate(): void {
    const isValidUuid = validateUuid(this.value);

    if (!isValidUuid || !this.value) {
      throw new Error("UUID inválido");
    }
  }
}
