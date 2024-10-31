import {
  ClutchFilter,
  ClutchSearchParams,
  ClutchSearchResult,
  IClutchRepository,
} from "@core/products/domain/clutch/clutch.repository";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { ProductTypeormRepository } from "@core/products/infra/db/typeorm/product.typeorm-repository";
import { Repository } from "typeorm";
import { ClutchModelMapper } from "@core/products/infra/db/typeorm/clutch/clutch.model-mapper";
import { SearchResult } from "@core/@shared/domain/repository/search-result";
import { getAvailabilityCondition } from "@core/products/infra/db/typeorm/common/queries";

export class ClutchTypeormRepository
  extends ProductTypeormRepository<ClutchId, Clutch, ClutchModel, ClutchFilter>
  implements IClutchRepository
{
  sortableFields: string[] = ["model", "color", "rentPrice"];

  constructor(private readonly clutchRepository: Repository<ClutchModel>) {
    super(clutchRepository, new ClutchModelMapper(), ClutchId);
  }

  getEntity(): { new (...args: any[]): Clutch } {
    return Clutch;
  }

  async search(props: ClutchSearchParams): Promise<ClutchSearchResult> {
    const { page, perPage, sort, sortDir, filter } = props;
    const offset = (page - 1) * perPage;
    const limit = perPage;
    const qb = this.modelRepository.createQueryBuilder("clutch");
    qb.leftJoinAndSelect("clutch.bookingItems", "bookingItems");
    qb.leftJoinAndSelect("bookingItems.booking", "booking");
    if (filter?.model) {
      qb.andWhere("clutch.model ILIKE :model", { model: `%${filter.model}%` });
    }
    if (filter?.color) {
      qb.andWhere("clutch.color ILIKE :color", { color: `%${filter.color}%` });
    }
    if (filter?.rentPrice !== undefined) {
      qb.andWhere("clutch.rentPrice = :rentPrice", {
        rentPrice: filter.rentPrice,
      });
    }
    if (filter?.available !== undefined) {
      const dbType = this.modelRepository.manager.connection.options.type;
      const alias = "clutch";
      const condition = getAvailabilityCondition(
        dbType,
        alias,
        filter.available,
      );
      qb.andWhere(condition, {
        startDate: filter.period.getStartDate().getValue().toISOString(),
        endDate: filter.period.getEndDate().getValue().toISOString(),
      });
    }
    if (sort && this.sortableFields.includes(sort)) {
      qb.orderBy(
        `clutch.${sort}`,
        sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC",
      );
    } else {
      qb.orderBy("clutch.createdAt", "DESC");
    }
    qb.skip(offset).take(limit);
    const [models, count] = await qb.getManyAndCount();
    const items = models.map((model) => this.modelMapper.toEntity(model));
    return new SearchResult({
      items,
      perPage,
      total: count,
      currentPage: page,
    });
  }
}
