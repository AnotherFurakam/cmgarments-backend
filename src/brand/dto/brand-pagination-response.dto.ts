import { GetBrandDto } from './get-brand.dto';

export class BrandPaginationResponseDto {
  totalPages: number;
  actualPage: number;
  nextPage: number | null;
  prevPage: number | null;
  data: GetBrandDto[];
}
