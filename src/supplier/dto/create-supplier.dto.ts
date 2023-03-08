import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumberString, IsString, Length, MaxLength, MinLength } from "class-validator";

export class CreateSupplierDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    @ApiProperty({
        description: 'Nombre del proveedor a registrar',
        minLength: 5,
        maxLength: 20,
        type: String,
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    @ApiProperty({
        description: 'Descripcion del proveedor al registrar',
        minLength: 0,
        maxLength: 1000,
        type: String,
    })
    description: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @ApiProperty({
        description: 'Direccion del proveedor al registrar',
        minLength: 0,
        maxLength: 100,
        type: String,
    })
    address: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(9, 9)
    @ApiProperty({
        description: 'Numero de telefono del proveedor al registrar',
        minLength: 9,
        maxLength: 9,
        type: String,
    })
    phone: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(11, 11)
    @ApiProperty({
        description: 'RUC del proveedor al registrar',
        minLength: 11,
        maxLength: 11,
        type: String,
    })
    ruc: string;

    @IsBoolean()
    @ApiProperty({
        description: 'Estado de habilitación del proveedor',
        type: Boolean,
    })
    state: boolean;
}