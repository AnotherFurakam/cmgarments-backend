import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create.employee.dto';

//Para que el dto herede tambien las apiproperties de swagger debemos usar el PartialType de swagger
//ya no el de mapped-types
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
