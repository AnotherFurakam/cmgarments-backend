import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id_account: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password_hash: string;

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'id_employee' })
  employee: Employee;

  @CreateDateColumn()
  create_at: Date;

  @CreateDateColumn()
  update_at: Date;

  @Column({ default: false })
  is_delete: boolean;
}
