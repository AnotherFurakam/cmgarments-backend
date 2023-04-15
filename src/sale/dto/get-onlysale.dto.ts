import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { CustomerResponseDto } from 'src/auth/dto/customer-response.dto';
import { GetSaleDetailDto } from './get-saleDetail.dto';
import { CustomerResponseSaleDto } from './customer-response.dto';


@Exclude()
export class GetOnlySaleDto {
    @Expose()
    id_sale: string;

    @Expose()
    @Transform(({ value }) => parseFloat(value))
    total_cost: string;

    @Transform(({ value }) => plainToInstance(CustomerResponseSaleDto, value))
    @Expose()
    customer: CustomerResponseSaleDto;

    @Transform(({ value }) => value.map(item => plainToInstance(GetSaleDetailDto, item)))
    @Expose()
    sale_detail: GetSaleDetailDto[];

    @Expose()
    @Transform(({ value }) => value.toLocaleString('en-GB'), {
        toPlainOnly: true,
        toClassOnly: true,
    })
    create_at: Date;

    @Expose()
    is_delete: Boolean;
}
