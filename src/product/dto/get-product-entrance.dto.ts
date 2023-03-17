import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetProductEntranceDto {
  @Expose()
  id_product: string;

  @Expose()
  name: string;
}
