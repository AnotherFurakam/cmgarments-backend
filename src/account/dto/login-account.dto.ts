import { IsNotEmpty, Length, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAccountDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @ApiProperty({
    description: 'Nombre de usuario',
    minLength: 10,
    maxLength: 20,
    type: String,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  @ApiProperty({
    description: 'Contraseña de usuario',
    minLength: 8,
    maxLength: 50,
    type: String,
  })
  password: string;
}
