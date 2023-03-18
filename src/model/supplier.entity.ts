
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { Entrance } from './entrance.entity';
import { Product } from './product.entity';
import { ProductSupplier } from './productsupplier.entity';
@Entity()
export class Supplier{
    @PrimaryGeneratedColumn('uuid')
    id_supplier: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    name: string;
    
    @Column({ type: 'varchar', length: 1000})
    description: string;

    @Column({ type: 'varchar', length: 100})
    address: string;

    @Column({ type: 'char', length: 9})
    phone: string;

    @Column({ type: 'char', length: 11})
    ruc: string;

    @Column()
    state: boolean;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @DeleteDateColumn()
    delete_at: Date; 
    
    @OneToMany(() => Entrance, (entrance) => entrance.id_entrance)
    entrance: Entrance[];
    
    @OneToMany(() => ProductSupplier, (product_supplier) => product_supplier.supplier)
    products_suppliers: ProductSupplier[];
}


