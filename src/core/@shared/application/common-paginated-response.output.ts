export class CommonPaginatedResponseOutput<Data> {
  items: Data[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}
