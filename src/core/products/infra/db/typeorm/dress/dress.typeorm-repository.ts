import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ProductTypeormRepository } from "@core/products/infra/db/typeorm/product.typeorm-repository";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import {
  DressFilter,
  IDressRepository,
} from "@core/products/domain/dress/dress.repository";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { DressModelMapper } from "@core/products/infra/db/typeorm/dress/dress.model-mapper";
import { SearchParams } from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";
import {
  getAvailableForPeriodQuery,
  getNotAvailableForPeriodQuery,
} from "@core/products/infra/db/typeorm/common/queries";

export class DressTypeormRepository
  extends ProductTypeormRepository<DressId, Dress, DressModel, DressFilter>
  implements IDressRepository
{
  sortableFields: string[] = ["model", "color", "fabric", "rentPrice"];

  constructor(private readonly dressRepository: Repository<DressModel>) {
    super(dressRepository, new DressModelMapper(), DressId);
  }

  async getAllAvailableForPeriod(period: Period): Promise<Dress[]> {
    const dbType = this.modelRepository.manager.connection.options.type;

    const query: string = getAvailableForPeriodQuery(dbType, "dress");

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

    const query: string = getNotAvailableForPeriodQuery(dbType, "dress");

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

  async search(props: SearchParams<DressFilter>): Promise<SearchResult<Dress>> {
    const { page, perPage, sort, sortDir, filter } = props;

    // Cálculo do offset e limit para paginação
    const offset = (page - 1) * perPage;
    const limit = perPage;

    // Construção da consulta dinâmica conforme os filtros
    const where: FindOptionsWhere<DressModel> = {};

    if (filter?.model) {
      where.model = ILike(`%${filter.model}%`);
    }

    if (filter?.color) {
      where.color = ILike(`%${filter.color}%`);
    }

    if (filter?.fabric) {
      where.fabric = ILike(`%${filter.fabric}%`);
    }

    if (filter?.rentPrice) {
      where.rentPrice = filter.rentPrice;
    }

    // Construção do objeto de ordenação
    const order: {
      [key: string]: "ASC" | "DESC";
    } = {};
    if (sort && this.sortableFields.includes(sort)) {
      order[sort] = sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    } else {
      order["createdAt"] = "DESC"; // Ordenação padrão
    }

    // Consulta ao banco de dados com paginação, ordenação e filtros aplicados
    const [models, count] = await this.modelRepository.findAndCount({
      where,
      order,
      skip: offset,
      take: limit,
    });

    // Mapeando os resultados para as entidades de domínio
    const items = models.map((model) => this.modelMapper.toEntity(model));

    // Retornando o resultado da busca com paginação
    return new SearchResult({
      items,
      perPage: perPage,
      total: count,
      currentPage: page,
    });
  }
}
