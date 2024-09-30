import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import {
  Appointment,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";
import { In, Repository } from "typeorm";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { AppointmentModelMapper } from "@core/appointment/infra/db/typeorm/appointment.model-mapper";

export class AppointmentTypeormRepository implements IAppointmentRepository {
  constructor(
    private readonly modelRepository: Repository<AppointmentModel>,
    private readonly modelMapper: AppointmentModelMapper = new AppointmentModelMapper(),
  ) {}

  async delete(aggregateId: AppointmentId): Promise<void> {
    const deleteResult = await this.modelRepository.delete(
      aggregateId.getValue(),
    );
    if (deleteResult.affected === 0) {
      throw new EntityNotFoundError(aggregateId, this.getEntity());
    }
  }

  async deleteManyByIds(aggregateIds: AppointmentId[]): Promise<void> {
    const existingAppointments = await this.existsById(aggregateIds);
    if (existingAppointments.notExists.length > 0) {
      throw new EntityNotFoundError(
        existingAppointments.notExists,
        this.getEntity(),
      );
    }
    const deleteResult = await this.modelRepository.delete(
      existingAppointments.exists.map((id) => id.getValue()),
    );
    if (deleteResult.affected !== existingAppointments.exists.length) {
      throw new EntityNotFoundError(
        existingAppointments.exists,
        this.getEntity(),
      );
    }
  }

  async existsById(
    aggregateIds: AppointmentId[],
  ): Promise<{ exists: AppointmentId[]; notExists: AppointmentId[] }> {
    const existingAppointments = await this.modelRepository.find({
      where: {
        id: In(aggregateIds.map((id) => id.getValue())),
      },
    });
    const existingIds = existingAppointments.map((appointment) =>
      AppointmentId.create(appointment.id),
    );
    const notExistingIds = aggregateIds.filter(
      (id) => !existingIds.find((existingId) => existingId.equals(id)),
    );
    return {
      exists: existingIds,
      notExists: notExistingIds,
    };
  }

  async findById(aggregateId: AppointmentId): Promise<Appointment | null> {
    const result = await this.modelRepository.findOne({
      where: {
        id: aggregateId.getValue(),
      },
    });
    if (!result) {
      return null;
    }
    return this.modelMapper.toEntity(result);
  }

  async findMany(): Promise<Appointment[]> {
    const result = await this.modelRepository.find();
    return result.map((model) => this.modelMapper.toEntity(model));
  }

  async findManyByIds(aggregateIds: AppointmentId[]): Promise<Appointment[]> {
    const result = await this.modelRepository.find({
      where: {
        id: In(aggregateIds.map((id) => id.getValue())),
      },
    });
    return result.map((model) => this.modelMapper.toEntity(model));
  }

  async save(aggregate: Appointment): Promise<void> {
    const model = this.modelMapper.toModel(aggregate);
    await this.modelRepository.save(model);
  }

  async saveMany(aggregates: Appointment[]): Promise<void> {
    const models = aggregates.map((aggregate) =>
      this.modelMapper.toModel(aggregate),
    );
    await this.modelRepository.save(models);
  }

  async update(aggregate: Appointment): Promise<void> {
    const model = this.modelMapper.toModel(aggregate);
    await this.modelRepository.update(model.id, model);
  }

  getEntity(): { new (...args: any[]): Appointment } {
    return Appointment;
  }
}
