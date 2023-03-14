import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseDto } from './create-purchase.dto';

//Para que el dto herede tambien las apiproperties de swagger debemos usar el PartialType de swagger
//ya no el de mapped-types
export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {}
