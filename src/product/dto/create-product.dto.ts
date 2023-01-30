import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({
    description: 'Nombre del producto a registrar',
    minLength: 8,
    maxLength: 50,
    type: String,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty({
    description: 'Nombre de la talla del producto al registrar',
    minLength: 1,
    maxLength: 20,
    type: String,
  })
  size: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @ApiProperty({
    description: 'Nombre del color del producto al registrar',
    minLength: 4,
    maxLength: 30,
    type: String,
  })
  color: string;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'Precio del producto al registrar',
    type: Number,
  })
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'Precio del producto al registrar',
    type: Number,
  })
  stock: number;

  @IsNotEmpty()
  @IsEnum(['Masculino', 'Femenino', null, ''])
  @ApiProperty({
    description: 'Tipo de genero del producto al registrar',
    type: String,
  })
  gender: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    description: 'Descripcion del producto al registrar',
    minLength: 0,
    maxLength: 1000,
    type: String,
  })
  description: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Estado de habilitación del producto',
    type: Boolean,
  })
  state: boolean;

  @ApiProperty({
    description: 'Sku del producto al registrar',
  })
  sku: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Id de la marca del producto al registrar',
    type: String,
  })
  brand: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Id de la categoria del producto al registrar',
    type: String,
  })
  category: string;
}
