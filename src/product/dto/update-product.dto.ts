import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

//Para que el dto herede tambien las apiproperties de swagger debemos usar el PartialType de swagger
//ya no el de mapped-types
export class UpdateProductDto extends PartialType(CreateProductDto) {}
