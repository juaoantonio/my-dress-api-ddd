import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";

export class ClutchOutput {
  id: string;
  rentPrice: number;
  name: string;
  color: string;
  model: string;
  isPickedUp: boolean;
  imagePath: string;
  type: string;
}

export class ClutchOutputMapper {
  static toOutput(clutch: Clutch): ClutchOutput {
    return {
      id: clutch.getId().value,
      rentPrice: clutch.getRentPrice(),
      name: clutch.getName(),
      color: clutch.getColor(),
      model: clutch.getModel(),
      isPickedUp: clutch.getIsPickedUp(),
      imagePath: clutch.getImagePath(),
      type: clutch.getType(),
    };
  }

  static toOutputMany(clutches: Clutch[]): ClutchOutput[] {
    return clutches.map((clutch) => ClutchOutputMapper.toOutput(clutch));
  }
}
