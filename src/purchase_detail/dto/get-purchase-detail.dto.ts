import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetProductDto } from 'src/product/dto/get-product.dto';

@Exclude()
export class GetPurchaseDetailDto {
  @Expose()
  id_purchase_detail: string;

  @Expose()
  @Transform(({ value }) => parseInt(value))
  units: number;

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  total_price: number;

  @Expose()
  date_purchase: Date;

  @Transform(({ value }) => plainToInstance(GetProductDto, value))
  @Expose()
  id_product: GetProductDto;

  @Transform(({ value }) => plainToInstance(GetPurchaseDetailDto, value))
  @Expose()
  id_purchase: GetPurchaseDetailDto;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  create_at: Date;
}