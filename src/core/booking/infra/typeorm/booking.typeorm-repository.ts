import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { Booking, BookingId } from "@core/booking/domain/booking.aggregate";
import { Repository } from "typeorm";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentModelMapper } from "@core/appointment/infra/db/typeorm/appointment.model-mapper";

export class BookingTypeormRepository implements IBookingRepository {
  constructor(
    private readonly modelRepository: Repository<AppointmentModel>,
    private readonly modelMapper: AppointmentModelMapper = new AppointmentModelMapper(),
  ) {}

  delete(aggregateId: BookingId): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteManyByIds(aggregateIds: BookingId[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  existsById(
    aggregateIds: BookingId[],
  ): Promise<{ exists: BookingId[]; notExists: BookingId[] }> {
    return Promise.resolve({ exists: [], notExists: [] });
  }

  findById(aggregateId: BookingId): Promise<Booking | null> {
    return Promise.resolve(undefined);
  }

  findMany(): Promise<Booking[]> {
    return Promise.resolve([]);
  }

  findManyByIds(aggregateIds: BookingId[]): Promise<Booking[]> {
    return Promise.resolve([]);
  }

  getEntity(): { new (...args: any[]): Booking } {
    return undefined;
  }

  save(aggregate: Booking): Promise<void> {
    return Promise.resolve(undefined);
  }

  saveMany(aggregates: Booking[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  update(aggregate: Booking): Promise<void> {
    return Promise.resolve(undefined);
  }
}
