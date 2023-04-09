import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEntranceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    description: 'Descripcion de la entrada',
    minLength: 0,
    maxLength: 1000,
    type: String,
  })
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: 'Unidades',
    minimum: 0,
    maximum: 100,
    type: Number,
  })
  units: number;

  @IsNotEmpty()
  @Min(0)
  @Max(1000)
  @ApiProperty({
    description: 'Costo de precio unitario',
    minimum: 0,
    maximum: 1000,
    type: Number,
  })
  unit_cost: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Id del detalle de comprar',
    type: String,
  })
  id_purchase_detail: string;
}
