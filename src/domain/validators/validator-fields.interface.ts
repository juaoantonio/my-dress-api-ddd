import { INotification } from "@domain/validators/notification.interface";

export type FieldsErrors =
  | {
      [field: string]: string[];
    }
  | string;

export interface IValidatorFields {
  validate(notification: INotification, data: any, fields?: string[]): void;
}
