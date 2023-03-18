import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetProductEntranceDto } from '../get-product-entrance.dto';

@Exclude()
export class ResponseImageProductDto {
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
