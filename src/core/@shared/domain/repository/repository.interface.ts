import { Entity } from "../entity";
import { Identifier } from "../identifier";

export interface IRepository<
  AggregateId extends Identifier,
  A extends Entity<AggregateId>,
> {
  save(aggregate: A): Promise<void>;

  saveMany(aggregates: A[]): Promise<void>;

  findById(aggregateId: AggregateId): Promise<A | null>;

  findMany(): Promise<A[]>;

  findManyByIds(aggregateIds: AggregateId[]): Promise<A[]>;

  update(aggregate: A): Promise<void>;

  delete(aggregateId: AggregateId): Promise<void>;

  deleteManyByIds(aggregateIds: AggregateId[]): Promise<void>;

  existsById(
    aggregateIds: AggregateId[],
  ): Promise<{ exists: AggregateId[]; notExists: AggregateId[] }>;

  getEntity(): new (...args: any[]) => A;
}
