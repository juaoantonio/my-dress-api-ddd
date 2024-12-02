import {
  Booking,
  BookingStatus,
} from "@core/booking/domain/booking.aggregate-root";

export class BookingOutput {
  id: string;
  expectedPickUpDate: string;
  expectedReturnDate: string;
  pickUpDate: string | null;
  returnDate: string | null;
  customerName: string;
  eventDate: string;
  amountPaid: number;
  totalBookingPrice: number;
  status: BookingStatus;
  dresses: BookingDressItemOutput[];
  clutches: BookingClutchItemOutput[];
}

export class BookingDressItemOutput {
  id: string;
  productId: string;
  rentPrice: number;
  color: string;
  model: string;
  fabric: string;
  imagePath: string;
  adjustments: AdjustmentOutput[];
  isCourtesy: boolean;
}

export class BookingClutchItemOutput {
  id: string;
  productId: string;
  rentPrice: number;
  color: string;
  model: string;
  imagePath: string;
  isCourtesy: boolean;
}

export class AdjustmentOutput {
  label: string;
  description: string;
}

export class BookingOutputMapper {
  public static toOutput(booking: Booking): BookingOutput {
    return {
      id: booking.getId().toString(),
      expectedPickUpDate: booking
        .getExpectedBookingPeriod()
        .getPickUpDate()
        .getValue()
        .toISOString(),
      expectedReturnDate: booking
        .getExpectedBookingPeriod()
        .getReturnDate()
        .getValue()
        .toISOString(),
      pickUpDate:
        booking.getBookingPeriod()?.getPickUpDate().getValue().toISOString() ||
        null,
      returnDate:
        booking.getBookingPeriod()?.getReturnDate()?.getValue().toISOString() ||
        null,
      amountPaid: booking.getAmountPaid(),
      totalBookingPrice: booking.calculateTotalPrice(),
      customerName: booking.getCustomerName(),
      eventDate: booking.getEventDate().getValue().toISOString(),
      status: booking.getStatus(),
      dresses: booking.getDresses().map((dress) => ({
        id: dress.getId().toString(),
        productId: dress.getProductId(),
        rentPrice: dress.getRentPrice(),
        model: dress.getModel(),
        color: dress.getColor(),
        fabric: dress.getFabric(),
        imagePath: dress.getImagePath(),
        adjustments: dress.getAdjustments().map((adjustment) => ({
          label: adjustment.label,
          description: adjustment.description,
        })),
        isCourtesy: dress.getIsCourtesy(),
      })),
      clutches: booking.getClutches().map((clutch) => ({
        id: clutch.getId().toString(),
        productId: clutch.getProductId(),
        rentPrice: clutch.getRentPrice(),
        isCourtesy: clutch.getIsCourtesy(),
        model: clutch.getModel(),
        color: clutch.getColor(),
        imagePath: clutch.getImagePath(),
      })),
    };
  }

  public static toOutputMany(bookings: Booking[]): BookingOutput[] {
    return bookings.map((booking) => BookingOutputMapper.toOutput(booking));
  }
}
