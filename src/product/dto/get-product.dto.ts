import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class GetProductDto {
  @Expose()
  id_product: string;

  @Expose()
  name: string;

  @Expose()
  size: string;

  @Expose()
  color: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  gender: string;

  @Expose()
  description: string;

  @Expose()
  state: boolean;

  @Expose()
  sku: string;

  @Expose()
  brand: string;

  @Expose()
  category: string;
}
