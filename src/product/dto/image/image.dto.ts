import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ImageDto {
  @Expose()
  title: string;

  @Expose()
  url: string;

  @Expose()
  main?: boolean;

  @Expose()
  id_product: string;
}
