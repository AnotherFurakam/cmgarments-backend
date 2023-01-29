import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id_role: string;

  @OneToMany(() => Employee, (employee) => employee.role)
  employee: Employee[];

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @CreateDateColumn()
  create_at: Date;

  @CreateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: boolean;
}
