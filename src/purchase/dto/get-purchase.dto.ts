import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetSupplierDto } from 'src/supplier/dto/get-supplier.dto';
@Exclude()
export class GetPurchaseDto {
  @Expose()
  id_purchase: string;

  @Expose()
  @Transform(({ value }) => parseInt(value))
  nro: number;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  total_price: number;

  @Expose()
  date_purchase: Date;

  @Transform(({ value }) => plainToInstance(GetSupplierDto, value))
  @Expose()
  id_supplier: GetSupplierDto;

  @Expose()
  @Transform(({ value }) => value.toLocaleString('en-GB'), {
    toPlainOnly: true,
    toClassOnly: true,
  })
  create_at: Date;
}
