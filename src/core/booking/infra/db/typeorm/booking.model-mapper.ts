import { IModelMapper } from "@core/@shared/infra/db/model.mapper.interface";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";

import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { BookingPeriod } from "@core/booking/domain/booking-period.vo";
import {
  BookingDressItem,
  BookingDressItemId,
} from "@core/booking/domain/entities/booking-dress-item.entity";
import { Adjustment } from "@core/booking/domain/entities/vo/adjustment.vo";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";
import { BookingItemClutchModel } from "@core/booking/infra/db/typeorm/booking-item-clutch.model";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";

export class BookingModelMapper implements IModelMapper<Booking, BookingModel> {
  toModel(entity: Booking): BookingModel {
    const bookingModel = new BookingModel();
    bookingModel.id = entity.getId().getValue();
    bookingModel.customerName = entity.getCustomerName();
    bookingModel.status = entity.getStatus();
    bookingModel.eventDate = entity.getEventDate().getValue();
    bookingModel.amountPaid = entity.getAmountPaid();
    bookingModel.expectedPickUpDate = entity
      .getExpectedBookingPeriod()
      .getPickUpDate()
      .getValue();
    bookingModel.expectedReturnDate = entity
      .getExpectedBookingPeriod()
      .getReturnDate()
      .getValue();
    bookingModel.pickUpDate = entity
      .getBookingPeriod()
      ?.getPickUpDate()
      .getValue();
    bookingModel.returnDate = entity
      .getBookingPeriod()
      ?.getReturnDate()
      ?.getValue();
    bookingModel.dresses = entity.getDresses().map((item) => {
      const bookingItemModel = new BookingItemDressModel();
      bookingItemModel.id = item.getId().getValue();
      bookingItemModel.rentPrice = item.getRentPrice();
      bookingItemModel.isCourtesy = item.getIsCourtesy();
      bookingItemModel.adjustments = item.getAdjustments();
      bookingItemModel.dressId = item.getProductId();
      bookingItemModel.bookingId = entity.getId().getValue();
      bookingItemModel.model = item.getModel();
      bookingItemModel.color = item.getColor();
      bookingItemModel.fabric = item.getFabric();
      bookingItemModel.imageUrl = item.getImagePath();
      return bookingItemModel;
    });
    bookingModel.clutches = entity.getClutches().map((item) => {
      const bookingItemModel = new BookingItemClutchModel();
      bookingItemModel.id = item.getId().getValue();
      bookingItemModel.rentPrice = item.getRentPrice();
      bookingItemModel.isCourtesy = item.getIsCourtesy();
      bookingItemModel.clutchId = item.getProductId();
      bookingItemModel.bookingId = entity.getId().getValue();
      bookingItemModel.model = item.getModel();
      bookingItemModel.color = item.getColor();
      bookingItemModel.imageUrl = item.getImagePath();
      return bookingItemModel;
    });
    return bookingModel;
  }

  toEntity(model: BookingModel): Booking {
    return new Booking({
      id: BookingId.create(model.id),
      customerName: model.customerName,
      amountPaid: model.amountPaid,
      status: model.status,
      eventDate: DateVo.create(model.eventDate),
      bookingPeriod: model.pickUpDate
        ? new BookingPeriod({
            pickUpDate: DateVo.create(model.pickUpDate),
            returnDate: model.returnDate
              ? DateVo.create(model.returnDate)
              : undefined,
          })
        : undefined,
      expectedBookingPeriod: new BookingPeriod({
        pickUpDate: DateVo.create(model.expectedPickUpDate),
        returnDate: DateVo.create(model.expectedReturnDate),
      }),
      dresses: model.dresses
        ? model.dresses.map((item) => {
            return new BookingDressItem({
              id: BookingDressItemId.create(item.id),
              rentPrice: item.rentPrice,
              isCourtesy: item.isCourtesy,
              adjustments: item.adjustments.map(
                (adjustment) =>
                  new Adjustment(adjustment.label, adjustment.description),
              ),
              productId: item.dressId,
              model: item.model,
              color: item.color,
              fabric: item.fabric,
              imagePath: item.imageUrl,
            });
          })
        : [],
      clutches: model.clutches
        ? model.clutches.map((item) => {
            return new BookingClutchItem({
              id: BookingDressItemId.create(item.id),
              rentPrice: item.rentPrice,
              isCourtesy: item.isCourtesy,
              productId: item.clutchId,
              model: item.model,
              color: item.color,
              imagePath: item.imageUrl,
            });
          })
        : [],
    });
  }
}
