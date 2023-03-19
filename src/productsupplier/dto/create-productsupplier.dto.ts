import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateProductSupplierDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Id del producto del producto/proveedor al registrar',
        type: String,
    })
    id_product: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Id del proveedor del producto/proveedor al registrar',
        type: String,
    })
    id_supplier: string;

    @IsNotEmpty()
    @Min(0)
    @Max(1000)
    @ApiProperty({
        description: 'Costo de precio unitario al registrar',
        minimum: 0,
        maximum: 1000,
        type: Number,
    })
    unit_cost: number;
}