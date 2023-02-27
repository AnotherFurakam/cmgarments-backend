import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @ApiProperty({
    description: 'Nombre de la marca a registrar',
    minLength: 3,
    maxLength: 20,
    type: String,
  })
  name: string;
}
