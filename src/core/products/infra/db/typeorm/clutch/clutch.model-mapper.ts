import { IModelMapper } from "@core/@shared/infra/db/model.mapper.interface";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";

export class ClutchModelMapper implements IModelMapper<Clutch, ClutchModel> {
  toEntity(model: ClutchModel): Clutch {
    return new Clutch({
      id: ClutchId.create(model.id),
      imagePath: model.imageUrl,
      model: model.model,
      color: model.color,
      rentPrice: model.rentPrice,
      isPickedUp: model.isPickedUp,
      reservationPeriods: model.bookingItems
        ? model.bookingItems.map(
            (item) =>
              new Period({
                startDate: DateVo.create(item.booking.expectedPickUpDate),
                endDate: DateVo.create(item.booking.expectedReturnDate),
              }),
          )
        : [],
    });
  }

  toModel(entity: Clutch): ClutchModel {
    const clutchModel = new ClutchModel();
    clutchModel.id = entity.getId().getValue();
    clutchModel.imageUrl = entity.getImagePath();
    clutchModel.model = entity.getModel();
    clutchModel.color = entity.getColor();
    clutchModel.rentPrice = entity.getRentPrice();
    clutchModel.isPickedUp = entity.getIsPickedUp();
    clutchModel.type = entity.getType();
    return clutchModel;
  }
}
