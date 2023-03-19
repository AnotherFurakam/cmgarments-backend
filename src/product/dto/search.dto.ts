import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SearchByEnum } from './search-by.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nombre o sku del producto a buscar en la bd',
    type: String,
  })
  text: string;

  @IsEnum(SearchByEnum)
  @ApiProperty({
    default: SearchByEnum.NAME,
    description: 'Criterio de búsqueda',
    type: String,
    enum: SearchByEnum,
  })
  searchBy: SearchByEnum;
}
