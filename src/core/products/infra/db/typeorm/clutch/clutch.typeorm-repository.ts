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
import {
  getAvailableForPeriodQuery,
  getNotAvailableForPeriodQuery,
} from "@core/products/infra/db/typeorm/common/queries";

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

    const query = getAvailableForPeriodQuery(dbType, "clutch");

    const availableClutches = await this.modelRepository
      .createQueryBuilder("clutch")
      .where(query, {
        startDate: period.getStartDate().getValue().toISOString(),
        endDate: period.getEndDate().getValue().toISOString(),
      })
      .getMany();

    return availableClutches.map((model) => this.modelMapper.toEntity(model));
  }

  async getAllNotAvailableForPeriod(period: Period): Promise<Clutch[]> {
    const dbType = this.modelRepository.manager.connection.options.type;

    const query = getNotAvailableForPeriodQuery(dbType, "clutch");

    const unavailableClutches = await this.modelRepository
      .createQueryBuilder("clutch")
      .where(query, {
        startDate: period.getStartDate().getValue().toISOString(),
        endDate: period.getEndDate().getValue().toISOString(),
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
