import { Exclude, Expose, Transform } from 'class-transformer';

//El exclude hace que las clases que no esten con @Expose() se excluyan de ser mostradas
//Esto es util cuando utilizamos el plainToClass para hacer auto mapping hacia esta clase
//excluyendo los campos que no coincidan con los expuestos en esta clase DTO
@Exclude()
export class GetBrandDto {
  @Expose()
  id_brand: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  createAt: Date;
}
