import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, MaxLength, MinLength, isString } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2,50)
  @ApiProperty({
    description: 'Nombre del cliente a registrar',
    minLength: 2,
    maxLength: 50,
    type: String,
  })
  names:string;

  @IsString()
  @IsNotEmpty()
  @Length(2,50)
  @ApiProperty({
    description: 'Primer apellido del cliente a registrar',
    minLength: 2,
    maxLength: 50,
    type: String,
  })
  first_lastname: string;

  @IsString()
  @IsNotEmpty()
  @Length(2,50)
  @ApiProperty({
    description: 'Segundo apellido del cliente a registrar',
    minLength: 2,
    maxLength: 50,
    type: String,
  })
  second_lastname: string;

  @IsString()
  @IsNotEmpty()
  @Length(8,8)
  @ApiProperty({
    description: 'Dni del cliente a registrar',
    minLength: 8,
    maxLength: 8,
    type: String,
  })
  dni: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(9,9)
  @ApiProperty({
    description: 'Número de teléfono del cliente a registrar',
    minLength: 9,
    maxLength: 9,
    type: String,
  })
  phone_number: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(6,50)
  @ApiProperty({
    description: 'Email del cliente a registrar',
    minLength: 6,
    maxLength: 50,
    type: String,
  })
  email: string;

  @IsString()
  @MinLength(8, {message: 'La contraseña debe tener como mínimo 8 caracteres'})
  @MaxLength(20, {message: 'La contraseña debe tener como máximo 20 caracteres'})
  @IsNotEmpty()
  @ApiProperty({
    description: 'Contraseña del cliente a registrar',
    minLength: 8,
    maxLength: 20,
    type: String,
  })
  password: string;
}