import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';
@Entity()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id_product: string;

    @Column({ type:'varchar', length: 50 })
    name: string;

    @Column({ type:'varchar', length: 20 })
    size: string;

    @Column({ type:'varchar', length: 30 })
    color: string;

    @Column({type:'decimal',precision:10, scale:2})
    price: number;

    @Column({type:'integer'})
    stock: number;

    @Column({ type: 'varchar', length: 20 })
    gender: string;

    @Column({ type: 'varchar', length: 1000 })
    description: string;

    @Column({ type: 'varchar' })
    stale: string;

    @Column({ type: 'varchar' })
    sku: string;

    @Column({ default: false })
    isDelete: boolean;

    @Column({ type: 'varchar' })
    brand: string;

    @Column({ type:'varchar' })
    category: string;
}