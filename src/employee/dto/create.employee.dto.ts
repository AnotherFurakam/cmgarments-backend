import {
  IsDate,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';


export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  names: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  first_lastname: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  second_lastname: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  dni: string;

  @IsNotEmpty()
  @IsString()
  @Length(9)
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  email: string;

  @IsNotEmpty()
  @IsDate()
  date_birth: Date;

  @IsNotEmpty()
  id_role: string;
}
