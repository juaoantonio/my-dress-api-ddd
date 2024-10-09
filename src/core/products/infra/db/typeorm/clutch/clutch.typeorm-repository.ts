import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { ProductTypeormRepository } from "@core/products/infra/db/typeorm/product.typeorm-repository";
import { Repository } from "typeorm";
import { ClutchModelMapper } from "@core/products/infra/db/typeorm/clutch/clutch.model-mapper";
import { SearchParams } from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export class ClutchTypeormRepository
  extends ProductTypeormRepository<ClutchId, Clutch, ClutchModel>
  implements IClutchRepository
{
  sortableFields: string[];

  constructor(private readonly clutchRepository: Repository<ClutchModel>) {
    super(clutchRepository, new ClutchModelMapper(), ClutchId);
  }

  async getAllAvailableForPeriod(period: Period): Promise<Clutch[]> {
    const dbType = this.modelRepository.manager.connection.options.type;

    let query: string;
    if (dbType === "postgres") {
      query = `
      NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(clutch.reservationPeriods) AS period
        WHERE (period->>'startDate')::timestamp <= :endDate
        AND (period->>'endDate')::timestamp >= :startDate
      )
    `;
    } else if (dbType === "sqlite") {
      query = `
      NOT EXISTS (
        SELECT 1
        FROM json_each(clutch.reservationPeriods) AS period
        WHERE json_extract(period.value, '$.startDate') <= :endDate
        AND json_extract(period.value, '$.endDate') >= :startDate
      )
    `;
    } else {
      throw new Error("Unsupported database type");
    }

    const availableClutches = await this.modelRepository
      .createQueryBuilder("clutch")
      .where(query, {
        startDate: period.getStartDate().getValue(),
        endDate: period.getEndDate().getValue(),
      })
      .getMany();

    return availableClutches.map((model) => this.modelMapper.toEntity(model));
  }

  async getAllNotAvailableForPeriod(period: Period): Promise<Clutch[]> {
    const dbType = this.modelRepository.manager.connection.options.type;

    let query: string;
    if (dbType === "postgres") {
      query = `
      EXISTS (
        SELECT 1
        FROM jsonb_array_elements(clutch.reservationPeriods) AS period
        WHERE (period->>'startDate')::timestamp <= :endDate
        AND (period->>'endDate')::timestamp >= :startDate
      )
    `;
    } else if (dbType === "sqlite") {
      query = `
      EXISTS (
        SELECT 1
        FROM json_each(clutch.reservationPeriods) AS period
        WHERE json_extract(period.value, '$.startDate') <= :endDate
        AND json_extract(period.value, '$.endDate') >= :startDate
      )
    `;
    } else {
      throw new Error("Unsupported database type");
    }

    const unavailableClutches = await this.modelRepository
      .createQueryBuilder("clutch")
      .where(query, {
        startDate: period.getStartDate().getValue(),
        endDate: period.getEndDate().getValue(),
      })
      .getMany();

    return unavailableClutches.map((model) => this.modelMapper.toEntity(model));
  }

  getEntity(): { new (...args: any[]): Clutch } {
    return Clutch;
  }

  search(props: SearchParams<string>): Promise<SearchResult<Clutch>> {
    return Promise.resolve(undefined);
  }
}
