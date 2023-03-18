import { Exclude, Expose } from 'class-transformer';

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
