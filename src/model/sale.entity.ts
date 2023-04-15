import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { SaleDetail } from './sale_detail.entity';

@Entity({ name: 'sale' })
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id_sale: string;

    @ManyToOne(() => Customer, (customer) => customer.sale)
    @JoinColumn({ name: 'id_customer' })
    customer: Customer;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_cost: string;

    @CreateDateColumn()
    create_at: Date;

    @Column({ default: false })
    is_delete: Boolean;

    @OneToMany(() => SaleDetail, (sale_detail) => sale_detail.sale)
    sale_detail: SaleDetail[];
}
