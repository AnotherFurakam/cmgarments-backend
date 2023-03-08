import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GetSupplierEntranceDto {
    @Expose()
    id_supplier: string;

    @Expose()
    name: string;
}