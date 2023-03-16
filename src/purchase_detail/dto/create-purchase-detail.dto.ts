import { IsNotEmpty, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePurchaseDetailDto {
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'Cantidad del producto en unidades',
  })
  units: number;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'Precio total de la compra',
  })
  total_price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Id del producto',
    minLength: 1,
    type: String,
  })
  id_product: any;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Id de la compra',
    minLength: 1,
    type: String,
  })
  id_purchase: any;
}
