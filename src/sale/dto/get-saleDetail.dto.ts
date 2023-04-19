import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { GetProductDto } from 'src/product/dto/get-product.dto';
import { GetSaleDto } from './get-sale.dto';

@Exclude()
export class GetSaleDetailDto {
    @Expose()
    id_sale_detail: string;

    @Expose()
    units: number;

    @Expose()
    price: string;

    @Expose()
    is_delete: Boolean;

    @Expose()
    saleId: string;

    @Transform(({ value }) => plainToInstance(GetProductDto, value))
    @Expose()
    product: GetProductDto;

    @Expose()
    @Transform(({ value }) => value.toLocaleString('en-GB'), {
        toPlainOnly: true,
        toClassOnly: true,
    })
    create_at: Date;
}
