import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";

export class InvalidSearchParamsError extends Error {
  constructor(params: FieldsErrors[]) {
    const message = `Parâmetros de busca inválidos: ${params.join(", ")}`;
    super(message);
    this.name = "InvalidSearchParamsError";
  }
}
