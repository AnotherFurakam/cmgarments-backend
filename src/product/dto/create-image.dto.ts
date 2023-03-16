import {
  IsNotEmpty,
  IsString,
  Length,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 40)
  @ApiProperty({
    description: 'Titulo de la Imagen del Producto',
    minLength: 4,
    maxLength: 40,
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'Archivo a subir',
  })
  image: Express.Multer.File;

  @IsBoolean()
  @ApiProperty({
    description: 'Saber si la imagen es principal',
    type: Boolean,
  })
  main?: boolean;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Id del producto',
    type: String,
  })
  id_product: string;
}
