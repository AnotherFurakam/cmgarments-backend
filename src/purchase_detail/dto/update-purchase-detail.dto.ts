import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseDetailDto } from './create-purchase-detail.dto';

//Para que el dto herede tambien las apiproperties de swagger debemos usar el PartialType de swagger
//ya no el de mapped-types
export class UpdatePurchaseDetailDto extends PartialType(
  CreatePurchaseDetailDto,
) {}
