import { AggregateRoot } from "@core/@shared/domain/aggregate-root";
import { Identifier } from "@core/@shared/domain/identifier";
import { ValueObject } from "@core/@shared/domain/value-object";

type SearchResultConstructorProps<A extends AggregateRoot<Identifier>> = {
  items: A[];
  total: number;
  current_page: number;
  per_page: number;
};

export class SearchResult<
  A extends AggregateRoot<Identifier> = AggregateRoot<Identifier>,
> extends ValueObject {
  readonly items: A[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;

  constructor(props: SearchResultConstructorProps<A>) {
    super();
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
  }

  toJSON() {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
    };
  }
}