import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetRoleDto {
  @Expose()
  id_role: string;

  @Expose()
  title: string;
}
