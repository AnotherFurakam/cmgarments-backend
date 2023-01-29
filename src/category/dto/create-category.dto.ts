import { IsNotEmpty, Length, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  @ApiProperty({
    description: 'Nombre de la Categoría a registrar',
    minLength: 4,
    maxLength: 20,
    type: String,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  @ApiProperty({
    description: 'Tallas de la Categoría a registrar',
    minLength: 1,
    type: String,
  })
  sizes: string;
}
