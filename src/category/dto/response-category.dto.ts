import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ResponseCategoryDto {
  @Expose()
  id_category: string;

  @Expose()
  name: string;

  @Expose()
  sizes: string;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  createdAt: Date;
}
