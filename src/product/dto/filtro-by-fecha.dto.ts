import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class FilterByDateDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha de inicio para el filtrado',
    type: String,
  })
  dateStart: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha de final para el filtrado',
    type: String,
  })
  dateEnd: string;
}
