import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetCategoryProductDto {
  @Expose()
  id_category: string;

  @Expose()
  name: string;
}
