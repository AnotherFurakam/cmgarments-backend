import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";

export class CreateSaleDetailDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'UUID del producto',
        type: String,
    })
    product_id: string;
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    @ApiProperty({
        description: 'Cantidad del producto',
        type: Number,
    })
    quantity: number;
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({
        description: 'Estado del producto',
        type: Boolean,
    })
    state: boolean;
}

export class CreateSaleDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'Id del customer de la venta al registrar',
        minLength: 1,
        maxLength: 20,
        type: String,
    })
    id_customer: string;
    
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleDetailDto)
    @ApiProperty({
        description: 'Array de objetos de detalles de venta',
        type: [CreateSaleDetailDto],
    })
    sale_details: CreateSaleDetailDto[];
}
