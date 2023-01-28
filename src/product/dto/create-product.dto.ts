import { IsDecimal, IsEnum, IsInt, isInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @ApiProperty({
        description: 'nombre del producto a registrar',
        minLength: 8,
        maxLength: 50,
        type: String,
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty({
        description: 'nombre de la talla del producto al registrar',
        minLength: 4,
        maxLength: 20,
        type: String,
    })
    size: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    @ApiProperty({
        description: 'nombre del color del producto al registrar',
        minLength: 4,
        maxLength: 30,
        type: String,
    })
    color: string;

    @IsNotEmpty()
    @Min(0)
    @ApiProperty({
        description: 'precio del producto al registrar',
        type: Number,
    })
    price: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @ApiProperty({
        description: 'precio del producto al registrar',
        type: Number,
    })
    stock: number;

    @IsNotEmpty()
    @IsEnum(['Masculino', 'Femenino'])
    @ApiProperty({
        description: 'tipo de genero del producto al registrar',
        type: String,
    })
    gender: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    @ApiProperty({
        description: 'descripcion del producto al registrar',
        minLength: 0,
        maxLength: 1000,
        type: String,
    })
    description: string;

    @IsEnum(['Habilitado', 'Desabilitado'])
    @ApiProperty({
        description: 'tipo de estado del producto al registrar',
        type: String,
    })
    stale: string;

    @ApiProperty({
        description: 'sku del producto al registrar',
    })
    sku: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'id de la marca del producto al registrar',
        type: String,
    })
    brand: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'id de la categoria del producto al registrar',
        type: String,
    })
    category: string;
}