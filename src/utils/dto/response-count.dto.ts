import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseCountDto {
  @Expose()
  type: string;

  @Expose()
  total: number;
}
