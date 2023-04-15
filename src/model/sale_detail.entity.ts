import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sale } from "./sale.entity";
import { Product } from "./product.entity";
import { Expose } from "class-transformer";

@Entity({ name: 'sale_detail' })
export class SaleDetail {
    @PrimaryGeneratedColumn('uuid')
    id_sale_detail: string;

    @ManyToOne(() => Sale, (sale) => sale.sale_detail)
    @JoinColumn({ name: 'id_sale' })
    sale: Sale;

    @ManyToOne(() => Product, (product) => product.sale_detail)
    @JoinColumn({ name: 'id_product' })
    product: Product;

    @Column({ type: 'integer', default: 0 })
    units: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @CreateDateColumn()
    create_at: Date;

    @Column({ default: false })
    is_delete: Boolean;

    @Expose()
    get saleId(): string {
        return this.sale?.id_sale;
    }
}