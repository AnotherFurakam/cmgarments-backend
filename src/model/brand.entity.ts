import { Product } from './product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id_brand: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  delete_at: boolean;

  @OneToMany(() => Product, (product) => product.id_product)
  products: Product[];
}
