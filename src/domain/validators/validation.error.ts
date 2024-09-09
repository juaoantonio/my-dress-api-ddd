import { FieldsErrors } from "@domain/validators/validator-fields.interface";

export class EntityValidationError extends Error {
  constructor(
    public errors: FieldsErrors,
    message = "Entity validation failed",
  ) {
    super(message + ": " + JSON.stringify(errors));
  }

  countErrors(): number {
    return Object.keys(this.errors).length;
  }
}

export class ValueObjectValidationError extends Error {
  constructor(
    public errors: FieldsErrors,
    message = "Value Object validation failed",
  ) {
    super(message + ": " + JSON.stringify(errors));
  }

  countErrors(): number {
    return Object.keys(this.errors).length;
  }
}
