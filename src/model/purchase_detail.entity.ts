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
import { Product } from './product.entity';
import { Purchase } from './purchase.entity';
import { Entrance } from './entrance.entity';

@Entity({ name: 'purchase_detail' })
export class Purchase_detail {
  @PrimaryGeneratedColumn('uuid')
  id_purchase_detail: string;

  @Column({ type: 'integer', default: 0 })
  units: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Product, (product) => product.purchase_detail)
  @JoinColumn({ name: 'id_product' })
  id_product: Product;

  @ManyToOne(() => Purchase, (purchase) => purchase.purchase_detail)
  @JoinColumn({ name: 'purchase' })
  id_purchase: Purchase;

  @OneToMany(() => Entrance, (entrance) => entrance.purchase_detail)
  entrance: Entrance[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: Date;
}
