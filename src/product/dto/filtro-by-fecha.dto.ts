import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class FilterByDateDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha de filtrado',
    type: String,
  })
  date: string;
}
