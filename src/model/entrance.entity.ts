import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Supplier } from './supplier.entity';
import { Purchase_detail } from './purchase_detail.entity';

@Entity()
export class Entrance {
  @PrimaryGeneratedColumn('uuid')
  id_entrance: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'integer' })
  units: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_cost: number;

  //   @ManyToOne(() => Product, (product) => product.entrance)
  //   @JoinColumn({ name: 'id_product' })
  //   product: Product;

  @ManyToOne(() => Purchase_detail, (pur_detail) => pur_detail.entrance)
  @JoinColumn({ name: 'id_purchase_detail' })
  purchase_detail: Purchase_detail;

  //   @ManyToOne(() => Supplier, (supplier) => supplier.entrance)
  //   @JoinColumn({ name: 'id_supplier' })
  //   supplier: Supplier;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: Date;
}
