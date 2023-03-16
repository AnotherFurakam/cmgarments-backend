// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
// } from 'typeorm';
// import { IsUrl, Length } from 'class-validator';
// import { Product } from './product.entity';
// import { ManyToOne, JoinColumn } from 'typeorm';

// @Entity('image')
// export class Image {
//   @PrimaryGeneratedColumn('uuid')
//   id_image: string;

//   @Column({ type: 'varchar', length: 40 })
//   @Length(4, 40)
//   title!: string;

//   @Column({ type: 'varchar', length: 255 })
//   @Length(4, 255)
//   @IsUrl()
//   url!: string;

//   @Column({ default: false })
//   main?: boolean;

//   @ManyToOne(() => Product, (product) => product.images)
//   @JoinColumn({ name: 'id_product' })
//   product: Product;

//   @CreateDateColumn()
//   createdAt!: Date;

//   @UpdateDateColumn()
//   updatedAt?: Date;

//   @DeleteDateColumn()
//   deletedAt?: Date;
// }
