import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CustomerResponseDto {
  @Expose()
  id_customer: string;

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
}