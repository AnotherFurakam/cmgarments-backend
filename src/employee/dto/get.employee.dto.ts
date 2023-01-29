import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { Role } from 'src/model/role.entity';
import { GetRoleDto } from 'src/role/dto/get-role.dto';

//El exclude hace que las clases que no esten con @Expose() se excluyan de ser mostradas
//Esto es util cuando utilizamos el plainToClass para hacer auto mapping hacia esta clase
//excluyendo los campos que no coincidan con los expuestos en esta clase DTO
@Exclude()
export class GetEmployeeDto {

  @Expose()
  id_employee: string

  @Expose()
  names: string;

  @Expose()
  first_lastname: string;

  @Expose()
  second_lastname: string;

  @Expose()
  dni: string;

  @Expose()
  phone_number: string;

  @Expose()
  email: string;

  @Expose()
  date_birth: Date;

  @Expose()
  state: boolean;

  //@Transform(({value}) => plainToInstance(GetRoleDto,value))
  @Expose()
  role: Role;

  @Expose()
  id_account: string;

}
