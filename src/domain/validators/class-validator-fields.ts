import {
  FieldsErrors,
  IValidatorFields,
} from "@domain/validators/validator-fields.interface";
import { validateSync } from "class-validator";

export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated>
{
  errors: FieldsErrors | null = null;
  validatedData: PropsValidated | null = null;

  validate(data: any): boolean {
    const errors = validateSync(data); // This is the class-validator function, that returns an array of errors

    if (!errors.length) {
      // If there are no errors, we set the validatedData to the data
      this.validatedData = data;
      return true;
    }

    // If there are errors, we map them to the errors object
    this.errors = {};
    errors.forEach((error) => {
      const field = error.property;
      this.errors[field] = Object.values(error.constraints);
    });
    return false;
  }
}
