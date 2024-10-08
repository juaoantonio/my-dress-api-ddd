import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ProductTypeormRepository } from "@core/products/infra/db/typeorm/product.typeorm-repository";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { Repository } from "typeorm";
import { DressModelMapper } from "@core/products/infra/db/typeorm/dress/dress.model-mapper";

export class DressTypeormRepository
  extends ProductTypeormRepository<DressId, Dress, DressModel>
  implements IDressRepository
{
  constructor(private readonly dressRepository: Repository<DressModel>) {
    super(dressRepository, new DressModelMapper(), DressId);
  }

  async getAllAvailableForPeriod(period: Period): Promise<Dress[]> {
    const dbType = this.modelRepository.manager.connection.options.type;

    let query: string;
    if (dbType === "postgres") {
      query = `
      NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(dress.reservationPeriods) AS period
        WHERE (period->>'startDate')::timestamp <= :endDate
        AND (period->>'endDate')::timestamp >= :startDate
      )
    `;
    } else if (dbType === "sqlite") {
      query = `
      NOT EXISTS (
        SELECT 1
        FROM json_each(dress.reservationPeriods) AS period
        WHERE json_extract(period.value, '$.startDate') <= :endDate
        AND json_extract(period.value, '$.endDate') >= :startDate
      )
    `;
    } else {
      throw new Error("Unsupported database type");
    }

    const availableDresses = await this.modelRepository
      .createQueryBuilder("dress")
      .where(query, {
        startDate: period.getStartDate().getValue(),
        endDate: period.getEndDate().getValue(),
      })
      .getMany();

    return availableDresses.map((model) => this.modelMapper.toEntity(model));
  }

  async getAllNotAvailableForPeriod(period: Period): Promise<Dress[]> {
    const dbType = this.modelRepository.manager.connection.options.type;

    let query: string;
    if (dbType === "postgres") {
      query = `
      EXISTS (
        SELECT 1
        FROM jsonb_array_elements(dress.reservationPeriods) AS period
        WHERE (period->>'startDate')::timestamp <= :endDate
        AND (period->>'endDate')::timestamp >= :startDate
      )
    `;
    } else if (dbType === "sqlite") {
      query = `
      EXISTS (
        SELECT 1
        FROM json_each(dress.reservationPeriods) AS period
        WHERE json_extract(period.value, '$.startDate') <= :endDate
        AND json_extract(period.value, '$.endDate') >= :startDate
      )
    `;
    } else {
      throw new Error("Unsupported database type");
    }

    const unavailableDresses = await this.modelRepository
      .createQueryBuilder("dress")
      .where(query, {
        startDate: period.getStartDate().getValue(),
        endDate: period.getEndDate().getValue(),
      })
      .getMany();

    return unavailableDresses.map((model) => this.modelMapper.toEntity(model));
  }

  getEntity(): { new (...args: any[]): Dress } {
    return Dress;
  }
}
