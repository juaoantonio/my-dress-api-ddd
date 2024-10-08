import { IModelMapper } from "@core/@shared/infra/db/model.mapper.interface";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { DressId } from "@core/products/domain/dress/dress-id.vo";

export class DressModelMapper implements IModelMapper<Dress, DressModel> {
  toEntity(model: DressModel): Dress {
    return new Dress({
      id: DressId.create(model.id),
      imagePath: model.imageUrl,
      model: model.model,
      color: model.color,
      fabric: model.fabric,
      rentPrice: model.rentPrice,
      isPickedUp: model.isPickedUp,
      reservationPeriods: model.reservationPeriods.map(
        (period) =>
          new Period({
            startDate: DateVo.create(period.startDate),
            endDate: DateVo.create(period.endDate),
          }),
      ),
    });
  }

  toModel(entity: Dress): DressModel {
    const dressModel = new DressModel();
    dressModel.id = entity.getId().getValue();
    dressModel.imageUrl = entity.getImagePath();
    dressModel.model = entity.getModel();
    dressModel.color = entity.getColor();
    dressModel.fabric = entity.getFabric();
    dressModel.rentPrice = entity.getRentPrice();
    dressModel.isPickedUp = entity.getIsPickedUp();
    dressModel.type = entity.getType();
    dressModel.reservationPeriods = entity
      .getReservationPeriods()
      .map((period) => ({
        startDate: period.getStartDate().getValue().toISOString(),
        endDate: period.getEndDate().getValue().toISOString(),
      }));
    return dressModel;
  }
}
