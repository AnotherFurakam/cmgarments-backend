import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ResponseCustomerDto {
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

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  create_at: Date;
}
