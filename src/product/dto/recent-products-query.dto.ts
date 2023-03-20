import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class RecentProductsQueryDto {
  @Min(1)
  @Max(10)
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'Cantidad de productos a obtener. Por defecto es 10',
    type: Number,
    required: false,
  })
  @Type(() => Number)
  quantity = 10;
}
