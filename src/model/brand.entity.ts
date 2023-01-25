import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id_brand: string;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ default: false })
  isDelete: boolean;

  @CreateDateColumn()
  createAt: Date;
}
