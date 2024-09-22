import { ValueObject } from "@domain/@shared/value-object";

import { InvalidAdjustmentError } from "@domain/booking/entities/vo/adjustment.error";

export class Adjustment extends ValueObject {
  constructor(
    public readonly label: string,
    public readonly description: string,
  ) {
    super();
    if (label.length < 1) {
      throw new InvalidAdjustmentError(
        "Rótulo do ajuste deve ter no mínimo 1 caractere",
      );
    }
    if (description.length < 1) {
      throw new InvalidAdjustmentError(
        "Descrição do ajuste deve ter no mínimo 1 caractere",
      );
    }
  }
}
