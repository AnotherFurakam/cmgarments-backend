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
import { Brand } from './brand.entity';
import { Category } from './category.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id_product: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  size: string;

  @Column({ type: 'varchar', length: 30 })
  color: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'varchar', length: 20 })
  gender: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column()
  state: boolean;

  @Column({ type: 'varchar', nullable: true })
  sku: string;

  @ManyToOne(() => Brand, (brand) => brand.id_brand)
  @JoinColumn({ name: 'brand' })
  brand: string;

  @ManyToOne(() => Category, (category) => category.id_category)
  @JoinColumn({ name: 'category' })
  category: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: Date;
}
