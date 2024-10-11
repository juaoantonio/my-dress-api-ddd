import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";
import { InvalidVoFields } from "@core/@shared/domain/error/invalid-vo-params";

export class InvalidSearchParamsError extends InvalidVoFields {
  constructor(public readonly errors: FieldsErrors[]) {
    super(errors);
    this.name = "InvalidSearchParamsError";
  }
}
