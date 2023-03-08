import { Exclude, Expose, Transform } from "class-transformer";
import { Length } from "class-validator";

@Exclude()
export class GetSupplierDto {
    @Expose()
    id_supplier: string;

    @Expose()
    name: string;
    
    @Expose()
    description: string;

    @Expose()
    address: string;

    @Length(9, 9)
    @Expose()
    phone: string;

    @Expose()
    ruc: string;

    @Expose()
    state: boolean;

    @Expose()
    @Transform(({ value }) => value.toLocaleString('en-GB'), {
        toPlainOnly: true,
        toClassOnly: true,
    })
    create_at: Date;
}
