export type FieldsErrors = {
  [field: string]: string[];
};

export interface IValidatorFields<PropsValidated> {
  errors: FieldsErrors | null;
  validatedData: PropsValidated | null;
  validate(props: any): boolean;
}
