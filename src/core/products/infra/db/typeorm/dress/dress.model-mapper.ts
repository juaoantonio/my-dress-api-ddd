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
    return dressModel;
  }
}
