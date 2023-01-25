import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

//Para que el dto herede tambien las apiproperties de swagger debemos usar el PartialType de swagger
//ya no el de mapped-types
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
