import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetOutputDto {
  @Expose()
  id_output: string;

  @Expose()
  description: string;

  @Expose()
  units: number;

  @Expose()
  unit_cost: number;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  create_at: Date;

  @Expose()
  total_price: number;
}
