import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetBrandProductDto {
  @Expose()
  id_brand: string;

  @Expose()
  name: string;
}
