import { IBookingRepository } from "@core/booking/domain/booking.repository";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { In, Repository } from "typeorm";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingModelMapper } from "@core/booking/infra/db/typeorm/booking.model-mapper";

export class BookingTypeormRepository implements IBookingRepository {
  constructor(
    private readonly modelRepository: Repository<BookingModel>,
    private readonly modelMapper: BookingModelMapper = new BookingModelMapper(),
  ) {}

  async save(aggregate: Booking): Promise<void> {
    const model = this.modelMapper.toModel(aggregate);
    await this.modelRepository.save(model);
  }

  async saveMany(aggregates: Booking[]): Promise<void> {
    const models = aggregates.map((aggregate) =>
      this.modelMapper.toModel(aggregate),
    );
    await this.modelRepository.save(models);
  }

  async findById(aggregateId: BookingId): Promise<Booking | null> {
    const result = await this.modelRepository.findOne({
      where: {
        id: aggregateId.getValue(),
      },
      loadEagerRelations: true,
    });
    if (!result) {
      return null;
    }
    return this.modelMapper.toEntity(result);
  }

  async findMany(): Promise<Booking[]> {
    const result = await this.modelRepository.find();
    return result.map((model) => this.modelMapper.toEntity(model));
  }

  async findManyByIds(aggregateIds: BookingId[]): Promise<Booking[]> {
    const result = await this.modelRepository.find({
      where: {
        id: In(aggregateIds.map((id) => id.getValue())),
      },
    });
    return result.map((model) => this.modelMapper.toEntity(model));
  }

  async update(aggregate: Booking): Promise<void> {
    const modelExists = await this.modelRepository.findOne({
      where: {
        id: aggregate.getId().getValue(),
      },
    });
    if (!modelExists) {
      throw new EntityNotFoundError(aggregate.getId(), this.getEntity());
    }
    const model = this.modelMapper.toModel(aggregate);
    await this.modelRepository.save(model);
  }

  async delete(aggregateId: BookingId): Promise<void> {
    const deleteResult = await this.modelRepository.delete(
      aggregateId.getValue(),
    );
    if (deleteResult.affected === 0) {
      throw new EntityNotFoundError(aggregateId, this.getEntity());
    }
  }

  async deleteManyByIds(aggregateIds: BookingId[]): Promise<void> {
    const existingBookings = await this.existsById(aggregateIds);
    if (existingBookings.notExists.length > 0) {
      throw new EntityNotFoundError(
        existingBookings.notExists,
        this.getEntity(),
      );
    }
    const deleteResult = await this.modelRepository.delete(
      existingBookings.exists.map((id) => id.getValue()),
    );
    if (deleteResult.affected !== existingBookings.exists.length) {
      throw new EntityNotFoundError(existingBookings.exists, this.getEntity());
    }
  }

  async existsById(
    aggregateIds: BookingId[],
  ): Promise<{ exists: BookingId[]; notExists: BookingId[] }> {
    const existingBookings = await this.modelRepository.find({
      where: {
        id: In(aggregateIds.map((id) => id.getValue())),
      },
    });
    const existingIds = existingBookings.map((booking) =>
      BookingId.create(booking.id),
    );
    const notExistingIds = aggregateIds.filter(
      (id) => !existingIds.find((existingId) => existingId.equals(id)),
    );
    return {
      exists: existingIds,
      notExists: notExistingIds,
    };
  }

  getEntity(): { new (...args: any[]): Booking } {
    return Booking;
  }
}
