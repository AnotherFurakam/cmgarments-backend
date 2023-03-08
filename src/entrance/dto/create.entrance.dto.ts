import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateEntranceDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    @ApiProperty({
        description: 'Descripcion de la entrada al registrar',
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
        description: 'Unidades de entrega al registrar',
        minimum: 0,
        maximum: 100, 
        type: Number,
    })
    units: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1000)
    @ApiProperty({
        description: 'Costo de precio unitario al registrar',
        minimum: 0,
        maximum: 1000,
        type: Number,
    })
    unit_cost: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Id del producto de entrada al registrar',
        type: String,
    })
    id_product: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Id del proveedor de entrada al registrar',
        type: String,
    })
    id_supplier: string;
}
