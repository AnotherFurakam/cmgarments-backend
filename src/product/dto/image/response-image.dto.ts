import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetProductEntranceDto } from '../get-product-entrance.dto';
import { GetProductDto } from '../get-product.dto';

@Exclude()
export class ResponseImageDto {
  @Expose()
  id_image: string;

  @Expose()
  title: string;

  @Expose()
  url: string;

  @Expose()
  main: boolean;

  @Transform(({ value }) => plainToInstance(GetProductEntranceDto, value))
  @Expose()
  product: GetProductEntranceDto;
}
