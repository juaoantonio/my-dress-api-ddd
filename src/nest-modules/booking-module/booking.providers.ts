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