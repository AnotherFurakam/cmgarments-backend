import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAccountDto {

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  password_hash: string

  @IsNotEmpty()
  @IsString()
  id_employee: string;


}
