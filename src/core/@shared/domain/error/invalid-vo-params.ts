import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";

export class InvalidVoFields extends Error {
  constructor(public readonly errors: FieldsErrors[]) {
    let message = "Parâmetros inválidos:";
    errors.forEach((error) => {
      if (typeof error === "object") {
        Object.keys(error).forEach((key) => {
          message += ` ${key}: ${error[key].join(", ")}.`;
        });
      } else {
        message += ` ${error}`;
      }
    });
    super(message);
    this.name = "InvalidParamsError";
  }
}
