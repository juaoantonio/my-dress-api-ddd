import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";

export class InvalidVoFields extends Error {
  constructor(public readonly errors: FieldsErrors[]) {
    const message = `Parâmetros inválidos: ${errors.join(", ")}`;
    super(message);
    this.name = "InvalidParamsError";
  }
}
