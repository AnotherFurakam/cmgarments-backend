import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Purchase_detail } from './purchase_detail.entity';
import { Supplier } from './supplier.entity';

@Entity({ name: 'purchase' })
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id_purchase: string;

  @Column()
  @Generated('increment')
  nro: number;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'date', nullable: false })
  date_purchase: Date;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchase)
  @JoinColumn({ name: 'id_supplier' })
  id_supplier: Supplier;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  @OneToMany(
    () => Purchase_detail,
    (purchase_detail) => purchase_detail.id_purchase,
  )
  @JoinColumn({ name: 'purchase_detail' })
  purchase_detail: Purchase_detail[];
}
