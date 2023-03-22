import { IsNotEmpty, IsString, IsUUID, Min, MinLength } from 'class-validator';
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
  price: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Id del producto',
    type: String,
  })
  id_product: string | any;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Id de la compra',
    type: String,
  })
  id_purchase: string | any;
}
