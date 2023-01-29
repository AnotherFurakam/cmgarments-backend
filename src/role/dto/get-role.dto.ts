import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetRoleDto {
  @Expose()
  id_role: string;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  create_at: Date;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  update_at: Date;

  @Expose()
  is_delete: boolean;
}
















