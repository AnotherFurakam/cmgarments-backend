import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CustomerResponseSaleDto {
  @Expose()
  id_customer: string;

  @Expose()
  names: string;
}