import { ProductTypeormRepository } from "@core/products/infra/db/typeorm/product.typeorm-repository";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import {
  DressFilter,
  DressSearchParams,
  DressSearchResult,
  IDressRepository,
} from "@core/products/domain/dress/dress.repository";
import { Repository } from "typeorm";
import { DressModelMapper } from "@core/products/infra/db/typeorm/dress/dress.model-mapper";
import { SearchResult } from "@core/@shared/domain/repository/search-result";
import { getAvailabilityCondition } from "@core/products/infra/db/typeorm/common/queries";

export class DressTypeormRepository
  extends ProductTypeormRepository<DressId, Dress, DressModel, DressFilter>
  implements IDressRepository
{
  sortableFields: string[] = ["model", "color", "fabric", "rentPrice"];

  constructor(private readonly dressRepository: Repository<DressModel>) {
    super(dressRepository, new DressModelMapper(), DressId);
  }

  getEntity(): { new (...args: any[]): Dress } {
    return Dress;
  }

  async search(props: DressSearchParams): Promise<DressSearchResult> {
    const { page, perPage, sort, sortDir, filter } = props;
    const offset = (page - 1) * perPage;
    const limit = perPage;
    const qb = this.modelRepository.createQueryBuilder("dress");
    qb.leftJoinAndSelect("dress.bookingItems", "bookingItems");
    qb.leftJoinAndSelect("bookingItems.booking", "booking");
    if (filter?.model) {
      qb.andWhere("dress.model ILIKE :model", { model: `%${filter.model}%` });
    }
    if (filter?.color) {
      qb.andWhere("dress.color ILIKE :color", { color: `%${filter.color}%` });
    }
    if (filter?.fabric) {
      qb.andWhere("dress.fabric ILIKE :fabric", {
        fabric: `%${filter.fabric}%`,
      });
    }
    if (filter?.name) {
      qb.where("dress.model ILIKE :name", {
        name: `%${filter.name}%`,
      }).orWhere("dress.color ILIKE :name", {
        name: `%${filter.name}%`,
      });
    }
    if (filter?.rentPrice !== undefined) {
      qb.andWhere("dress.rentPrice = :rentPrice", {
        rentPrice: filter.rentPrice,
      });
    }
    if (filter?.available !== undefined) {
      const dbType = this.modelRepository.manager.connection.options.type;
      const alias = "dress";
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
    if (filter?.bookingId) {
      qb.orWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("1")
          .from("dress_booking_item", "bookingItems")
          .where("bookingItems.bookingId = :bookingId")
          .getQuery();

        return `EXISTS (${subQuery})`;
      }).setParameter("bookingId", filter.bookingId);
    }
    if (sort && this.sortableFields.includes(sort)) {
      qb.orderBy(
        `dress.${sort}`,
        sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC",
      );
    } else {
      qb.orderBy("dress.createdAt", "DESC");
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
