import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetBrandDto } from 'src/brand/dto/get-brand.dto';
import { ResponseCategoryDto } from '../../category/dto/response-category.dto';
import { GetBrandProductDto } from 'src/brand/dto/get-brand-product.dto';
import { GetCategoryProductDto } from 'src/category/dto/get-catogory-product.dto';
@Exclude()
export class GetProductByIdBrandDto {
  @Expose()
  id_product: string;

  @Expose()
  name: string;

  @Expose()
  size: string;

  @Expose()
  color: string;

  @Expose()
  price: string;

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

  @Transform(({ value }) => plainToInstance(GetBrandProductDto, value))
  @Expose()
  brand: GetBrandDto;

  @Transform(({ value }) => plainToInstance(GetCategoryProductDto, value))
  @Expose()
  category: ResponseCategoryDto;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  create_at: Date;
}
