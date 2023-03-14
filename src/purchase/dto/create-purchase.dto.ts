import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePurchaseDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @ApiProperty({
    description: 'Description de la compra',
    minLength: 1,
    maxLength: 1000,
    type: String,
  })
  description: string;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'Precio total de la compra',
  })
  total_price: number;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    description: 'Fecha de compra',
  })
  date_purchase: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Id del proveedor a mostrar',
    type: String,
  })
  id_supplier: any;
}
