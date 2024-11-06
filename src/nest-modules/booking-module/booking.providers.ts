import { ProviderType } from "@nest/shared-module/types/provider.type";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingTypeormRepository } from "@core/booking/infra/db/typeorm/booking.typeorm-repository";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateBookingProcessUseCase } from "@core/booking/application/create-booking-process/create-booking-process.use-case";
import { InitBookingProcessUseCase } from "@core/booking/application/init-booking-process/init-booking-process.use-case";
import { AddBookingItemsUseCase } from "@core/booking/application/add-booking-items/add-booking-items.use-case";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { DRESS_PROVIDERS } from "@nest/dress-module/dress.provider";
import { CLUTCH_PROVIDERS } from "@nest/clutch-module/clutch.provider";
import { AddAdjustmentsUseCase } from "@core/booking/application/add-adjustments/add-adjustments.use-case";
import { GetBookingUseCase } from "@core/booking/application/get-booking/get-booking.use-case";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { GetPaginatedBookingsUseCase } from "@core/booking/application/get-paginated-bookings/get-paginated-bookings.use-case";
import { UpdatePaymentUseCase } from "@core/booking/application/update-payment/update-payment.use-case";
import { CancelBookingUseCase } from "@core/booking/application/cancel-booking/cancel-booking.use-case";
import { StartBookingUseCase } from "@core/booking/application/start-booking-process/start-booking-process.use-case";
import { CompleteBookingUseCase } from "@core/booking/application/complete-booking/complete-booking.use-case";

export const REPOSITORIES: ProviderType = {
  DEFAULT_BOOKING_REPOSITORY: {
    provide: "IBookingRepository",
    useExisting: BookingTypeormRepository,
  },
  TYPEORM_BOOKING_REPOSITORY: {
    provide: BookingTypeormRepository,
    useFactory: (bookingRepository: Repository<BookingModel>) => {
      return new BookingTypeormRepository(bookingRepository);
    },
    inject: [getRepositoryToken(BookingModel)],
  },
};

export const USE_CASES: ProviderType = {
  CREATE_BOOKING_PROCESS_USE_CASE: {
    provide: CreateBookingProcessUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new CreateBookingProcessUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },

  INIT_BOOKING_PROCESS_USE_CASE: {
    provide: InitBookingProcessUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new InitBookingProcessUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },

  ADD_BOOKING_ITEMS_USE_CASE: {
    provide: AddBookingItemsUseCase,
    useFactory: (
      bookingRepository: IBookingRepository,
      dressRepository: IDressRepository,
      clutchRepository: IClutchRepository,
    ) => {
      return new AddBookingItemsUseCase(
        bookingRepository,
        dressRepository,
        clutchRepository,
      );
    },
    inject: [
      REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide,
      DRESS_PROVIDERS.REPOSITORIES.DEFAULT_DRESS_REPOSITORY.provide,
      CLUTCH_PROVIDERS.REPOSITORIES.DEFAULT_CLUTCH_REPOSITORY.provide,
    ],
  },

  ADD_ADJUSTMENTS_USE_CASE: {
    provide: AddAdjustmentsUseCase,
    useFactory: (
      bookingRepository: IBookingRepository,
      dressRepository: IDressRepository,
    ) => {
      return new AddAdjustmentsUseCase(bookingRepository, dressRepository);
    },
    inject: [
      REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide,
      DRESS_PROVIDERS.REPOSITORIES.DEFAULT_DRESS_REPOSITORY.provide,
    ],
  },

  UPDATE_PAYMENT_USE_CASE: {
    provide: UpdatePaymentUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new UpdatePaymentUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },

  CANCEL_BOOKING_USE_CASE: {
    provide: CancelBookingUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new CancelBookingUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },

  START_BOOKING_USE_CASE: {
    provide: StartBookingUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new StartBookingUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },

  COMPLETE_BOOKING_USE_CASE: {
    provide: CompleteBookingUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new CompleteBookingUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },

  GET_PAGINATED_BOOKINGS_USE_CASE: {
    provide: GetPaginatedBookingsUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new GetPaginatedBookingsUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },

  GET_BOOKING_USE_CASE: {
    provide: GetBookingUseCase,
    useFactory: (bookingRepository: IBookingRepository) => {
      return new GetBookingUseCase(bookingRepository);
    },
    inject: [REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide],
  },
};

export const BOOKING_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
