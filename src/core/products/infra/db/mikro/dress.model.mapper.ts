import { Dress } from "../../../domain/dress/dress.aggregate-root";
import { DressModel, ReservationPeriodModel } from "./dress.model";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { IModelMapper } from "@core/@shared/infra/db/model.mapper.interface";
import { DressId } from "@core/products/domain/dress/dress-id.vo";

export class DressModelMapper implements IModelMapper<Dress, DressModel> {
  toModel(entity: Dress): DressModel {
    return new DressModel({
      id: entity.getId().getValue(),
      model: entity.getModel(),
      color: entity.getColor(),
      fabric: entity.getFabric(),
      rentPrice: entity.getRentPrice(),
      imageUrl: entity.getImageUrl(),
      isPickedUp: entity.getIsPickedUp(),
      reservationPeriods: entity
        .getReservationPeriods()
        .map((period) => ReservationPeriodMapper.create().toModel(period)),
    });
  }

  toEntity(model: DressModel): Dress {
    return new Dress({
      id: DressId.create(model.id),
      imageUrl: model.imageUrl,
      rentPrice: model.rentPrice,
      color: model.color,
      model: model.model,
      fabric: model.fabric,
      isPickedUp: model.isPickedUp,
      reservationPeriods: model.reservationPeriods.map((period) =>
        ReservationPeriodMapper.create().toEntity(period),
      ),
    });
  }
}

class ReservationPeriodMapper
  implements IModelMapper<Period, ReservationPeriodModel>
{
  static create(): ReservationPeriodMapper {
    return new ReservationPeriodMapper();
  }

  toModel(period: Period): ReservationPeriodModel {
    const model = new ReservationPeriodModel();
    model.startDate = period.getStartDate().getValue();
    model.endDate = period.getEndDate().getValue();
    return model;
  }

  toEntity(model: ReservationPeriodModel): Period {
    return new Period({
      startDate: DateVo.create(model.startDate),
      endDate: DateVo.create(model.endDate),
    });
  }
}
