import { PartialType } from '@nestjs/swagger';
import { CreateEntranceDto } from './create.entrance.dto';

//Para que el dto herede tambien las apiproperties de swagger debemos usar el PartialType de swagger
//ya no el de mapped-types
export class UpdateEntranceDto extends PartialType(CreateEntranceDto) {}
