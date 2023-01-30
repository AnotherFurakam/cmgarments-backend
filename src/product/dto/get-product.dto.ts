import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetBrandDto } from 'src/brand/dto/get-brand.dto';
import { ResponseCategoryDto } from '../../category/dto/response-category.dto';
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

  @Transform(({ value }) => plainToInstance(GetBrandDto, value))
  @Expose()
  brand: GetBrandDto;

  @Transform(({ value }) => plainToInstance(ResponseCategoryDto, value))
  @Expose()
  category: ResponseCategoryDto;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  create_at: Date;
}
