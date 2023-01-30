import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({
    description: 'Nombres del empleado',
    minLength: 3,
    maxLength: 50,
  })
  names: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({
    description: 'Apellido paterno del empleado',
    minLength: 3,
    maxLength: 50,
  })
  first_lastname: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({
    description: 'Apellido materno del empleado',
    minLength: 3,
    maxLength: 50,
  })
  second_lastname: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @ApiProperty({
    description: 'Dni del empleado',
    minLength: 8,
    maxLength: 50,
  })
  dni: string;

  @IsNotEmpty()
  @IsString()
  @Length(9)
  @ApiProperty({
    description: 'Teléfono celular del empleado',
    minLength: 9,
    maxLength: 9,
  })
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  @MaxLength(35)
  @ApiProperty({
    description: 'Email del empleado',
    minLength: 9,
    maxLength: 9,
  })
  email: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    description: 'Fecha de nacimiento del empleado',
    minLength: 9,
    maxLength: 9,
  })
  date_birth: Date;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Id del rol del empleado',
    minLength: 9,
    maxLength: 9,
  })
  id_role: string;
}
