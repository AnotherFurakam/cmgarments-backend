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
import { Purchase_detail } from './purchase_detail.entity';
import { SaleDetail } from './sale_detail.entity';

@Entity()
export class Output {
  @PrimaryGeneratedColumn('uuid')
  id_output: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'integer' })
  units: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_cost: string;

  @ManyToOne(() => SaleDetail, (sale_detail) => sale_detail.output)
  @JoinColumn({ name: 'id_sale_detail' })
  sale_detail: SaleDetail;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: Date;

  get total_price(): string {
    return (this.units * Number(this.unit_cost)).toFixed(2);
  }
}
