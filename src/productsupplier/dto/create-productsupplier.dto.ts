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
    @ApiProperty({
        description: 'Costo de precio unitario al registrar',
        type: String,
    })
    unit_cost: string;
}