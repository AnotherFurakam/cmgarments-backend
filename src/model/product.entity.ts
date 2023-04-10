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
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { Image } from './image.entity';
import { Purchase_detail } from './purchase_detail.entity';
import { ProductSupplier } from './productsupplier.entity';

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

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 20 })
  gender: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column()
  state: boolean;

  @Column({ type: 'varchar', nullable: true })
  sku: string;

  //? ManyToOne
  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category' })
  category: Category;

  // //? OneToMany
  // @OneToMany(() => Entrance, (entrance) => entrance.id_entrance)
  // entrance: Entrance[];

  @OneToMany(
    () => Purchase_detail,
    (purchase_detail) => purchase_detail.id_product,
  )
  // @JoinColumn({ name: 'purchase_detail' })
  purchase_detail: Purchase_detail[];

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  @OneToMany(
    () => ProductSupplier,
    (product_supplier) => product_supplier.product,
  )
  products_suppliers: ProductSupplier[];
}
