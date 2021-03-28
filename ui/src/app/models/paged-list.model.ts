export interface PagedList<T> {
  totalCount: number;
  pageSize: number;
  page: number;
  totalPages: number;
  sortOrder: string;
  sortBy: string;
  items: T[];
}
