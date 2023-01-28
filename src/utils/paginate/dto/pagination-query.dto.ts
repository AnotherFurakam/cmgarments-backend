import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit = 10;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page = 1;
}