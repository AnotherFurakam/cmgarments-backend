import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { Image } from 'src/model/image.entity';
import { ImageDto } from './dto/image/image.dto';

@Exclude()
export class ProductImageDto {
  @Expose()
  id_product: string;

  @Expose()
  name: string;

  @Expose()
  size: string;

  @Expose()
  @Transform(({ value }) => plainToInstance(ImageDto, value))
  images: Image[];
}
