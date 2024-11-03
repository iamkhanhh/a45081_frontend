export const PageSizes = [10, 20, 30, 40, 50];

export interface IPaginatorState {
  page: number;
  pageSize: number;
  total: number;
  pageBegin: number;
  pageEnd: number;
  totalPages: number;
  recalculatePaginator(pageBegin: number, pageEnd: number, total: number, totalPages: number): IPaginatorState;
}

export class PaginatorState implements IPaginatorState {
  page = 1;
  pageSize = PageSizes[0];
  total = 0;
  pageBegin = 0;
  totalPages = 1;
  pageEnd = this.pageSize;
  pageSizes: number[] = [];

  recalculatePaginator(pageBegin: number, pageEnd: number, total: number, totalPages: number): PaginatorState {
    this.pageBegin = pageBegin;
    this.pageEnd = pageEnd;
    this.totalPages = totalPages;
    this.total = total;
    return this;
  }
}
