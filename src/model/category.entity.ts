import { Length } from 'class-validator';
import { Product } from './product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id_category: string;

  @Column({ type: 'varchar', length: 20 })
  @Length(4, 20)
  name!: string;

  @Column({ type: 'varchar' })
  @Length(1)
  sizes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Product, (product) => product.id_product)
  products: Product[];
}
