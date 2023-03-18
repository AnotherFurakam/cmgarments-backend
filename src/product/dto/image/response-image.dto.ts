import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetProductEntranceDto } from '../get-product-entrance.dto';

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
}
