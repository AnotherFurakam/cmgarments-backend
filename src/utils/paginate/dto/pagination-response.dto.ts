export class PaginationResponseDto<T> {
  totalPages: number;
  actualPage: number;
  nextPage: number | null;
  prevPage: number | null;
  data: T;
}
