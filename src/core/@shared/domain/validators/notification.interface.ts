import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";

export interface INotification {
  errors: Map<string, string | string[]>;

  addError(error: string, field?: string): void;

  setError(error: string | string[], field?: string): void;

  hasErrors(): boolean;

  copyErrors(notifications: INotification): void;

  toJSON(): FieldsErrors[];
}
