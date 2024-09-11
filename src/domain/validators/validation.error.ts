import { FieldsErrors } from "@domain/validators/validator-fields.interface";

export class EntityValidationError extends Error {
  constructor(
    public errors: FieldsErrors[],
    message = "Entidade inválida",
  ) {
    super(message);
    this.name = "EntityValidationError";
  }

  countErrors(): number {
    return Object.keys(this.errors).length;
  }
}
