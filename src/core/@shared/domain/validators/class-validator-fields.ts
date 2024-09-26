import { IValidatorFields } from "./validator-fields.interface";
import { validateSync } from "class-validator";
import { INotification } from "./notification.interface";

export abstract class ClassValidatorFields implements IValidatorFields {
  validate(notification: INotification, data: any, fields?: string[]): void {
    const errors = validateSync(data, {
      groups: fields,
    });

    if (errors.length > 0) {
      for (const error of errors) {
        const field = error.property;
        Object.values(error.constraints).forEach((message) => {
          notification.addError(message, field);
        });
      }
    }
  }
}
