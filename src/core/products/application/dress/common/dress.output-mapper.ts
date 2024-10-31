import { Dress } from "@core/products/domain/dress/dress.aggregate-root";

export class DressOutput {
  id: string;
  rentPrice: number;
  name: string;
  color: string;
  model: string;
  fabric: string;
  isPickedUp: boolean;
  imagePath: string;
  type: string;
  reservationPeriods: {
    startDate: string;
    endDate: string;
  }[];
}

export class DressOutputMapper {
  static toOutput(dress: Dress): DressOutput {
    return {
      id: dress.getId().value,
      rentPrice: dress.getRentPrice(),
      name: dress.getName(),
      color: dress.getColor(),
      model: dress.getModel(),
      fabric: dress.getFabric(),
      isPickedUp: dress.getIsPickedUp(),
      imagePath: dress.getImagePath(),
      type: dress.getType(),
      reservationPeriods: dress.getReservationPeriods().map((period) => ({
        startDate: period.getStartDate().getValue().toISOString(),
        endDate: period.getEndDate().getValue().toISOString(),
      })),
    };
  }

  static toOutputMany(dresses: Dress[]): DressOutput[] {
    return dresses.map((dress) => DressOutputMapper.toOutput(dress));
  }
}
