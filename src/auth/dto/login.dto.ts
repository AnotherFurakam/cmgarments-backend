import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Max, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email del cliente',
    minLength: 6,
    maxLength: 50,
    type: String,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({
    description: 'Contraseña del cliente',
    minLength: 8,
    maxLength: 20,
    type: String,
  })
  password: string;
}