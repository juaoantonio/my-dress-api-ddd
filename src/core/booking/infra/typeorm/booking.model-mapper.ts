import { IModelMapper } from "@core/@shared/infra/db/model.mapper.interface";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { BookingModel } from "@core/booking/infra/typeorm/booking.model";
import { BookingItemModel } from "@core/booking/infra/typeorm/booking-item.model";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { BookingPeriod } from "@core/booking/domain/booking-period.vo";
import {
  BookingItem,
  BookingItemId,
} from "@core/booking/domain/entities/booking-item.entity";
import { Adjustment } from "@core/booking/domain/entities/vo/adjustment.vo";

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
      .getValue();
    bookingModel.items = entity.getItems().map((item) => {
      const bookingItemModel = new BookingItemModel();
      bookingItemModel.id = item.getId().getValue();
      bookingItemModel.type = item.getType();
      bookingItemModel.rentPrice = item.getRentPrice();
      bookingItemModel.isCourtesy = item.getIsCourtesy();
      bookingItemModel.adjustments = item.getAdjustments();
      bookingItemModel.productId = item.getProductId();
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
        ? BookingPeriod.create({
            pickUpDate: DateVo.create(model.pickUpDate),
            returnDate: model.returnDate
              ? DateVo.create(model.returnDate)
              : undefined,
          })
        : undefined,
      expectedBookingPeriod: BookingPeriod.create({
        pickUpDate: DateVo.create(model.expectedPickUpDate),
        returnDate: DateVo.create(model.expectedReturnDate),
      }),
      items: model.items.map((item) => {
        return new BookingItem({
          id: BookingItemId.create(item.id),
          type: item.type,
          rentPrice: item.rentPrice,
          isCourtesy: item.isCourtesy,
          adjustments: item.adjustments.map(
            (adjustment) =>
              new Adjustment(adjustment.label, adjustment.description),
          ),
          productId: item.productId,
        });
      }),
    });
  }
}
