import { Exclude, Expose, plainToInstance, Transform } from "class-transformer";
import { GetProductEntranceDto } from "src/product/dto/get-product-entrance.dto";
import { GetProductDto } from "src/product/dto/get-product.dto";
import { GetSupplierEntranceDto } from "src/supplier/dto/get-supplier-entrance.dto";
import { GetSupplierDto } from "src/supplier/dto/get-supplier.dto";

@Exclude()
export class GetEntranceDto {
    @Expose()
    id_entrance: string;

    @Expose()
    description: string;

    @Expose()
    units: number;

    @Expose()
    unit_cost: number;

    @Transform(({ value }) => plainToInstance(GetProductEntranceDto, value))
    @Expose()
    product: GetProductDto;

    @Transform(({ value }) => plainToInstance(GetSupplierEntranceDto, value))
    @Expose()
    supplier: GetSupplierDto;

    @Expose()
    @Transform(({ value }) => value.toLocaleString('en-GB'), {
        toPlainOnly: true,
        toClassOnly: true,
      })
    create_at: Date;
}