import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
}
