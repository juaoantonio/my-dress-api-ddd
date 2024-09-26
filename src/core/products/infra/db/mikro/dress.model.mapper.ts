import { Dress } from "../../../domain/dress/dress.aggregate";
import { DressModel, ReservationPeriodModel } from "./dress.model";
import { Period } from "../../../../@shared/domain/vo/period.vo";
import { DressId } from "../../../domain/dress/dress-id.vo";
import { DateVo } from "../../../../@shared/domain/vo/date.vo";
import { IModelMapper } from "../../../../@shared/infra/db/mikro/model.mapper.interface";

export class DressModelMapper implements IModelMapper<Dress, DressModel> {
  toModel(entity: Dress): DressModel {
    const model = new DressModel(entity.getId().getValue());
    model.imageUrl = entity.getImageUrl();
    model.rentPrice = entity.getRentPrice();
    model.color = entity.getColor();
    model.model = entity.getModel();
    model.fabric = entity.getFabric();
    model.isPickedUp = entity.getIsPickedUp();
    model.reservationPeriods = entity
      .getReservationPeriods()
      .map((period) => ReservationPeriodMapper.create().toModel(period));
    return model;
  }

  toEntity(model: DressModel): Dress {
    const entity = new Dress({
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
    return entity;
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
    model.startDate = period.getStartDate().getDate();
    model.endDate = period.getEndDate().getDate();
    return model;
  }

  toEntity(model: ReservationPeriodModel): Period {
    const entity = new Period({
      startDate: DateVo.create(model.startDate),
      endDate: DateVo.create(model.endDate),
    });
    return entity;
  }
}
