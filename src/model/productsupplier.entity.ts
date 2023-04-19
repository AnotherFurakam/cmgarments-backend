import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Supplier } from "./supplier.entity";

@Entity()
export class ProductSupplier {
    @PrimaryGeneratedColumn('uuid')
    id_productsupplier: string;

    @ManyToOne(() => Product, (product) => product.products_suppliers)
    @JoinColumn({ name: 'id_product' })
    product: Product;

    @ManyToOne(() => Supplier, (supplier) => supplier.products_suppliers)
    @JoinColumn({ name: 'id_supplier' })
    supplier: Supplier;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_cost: string;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @DeleteDateColumn()
    delete_at: Date;
}