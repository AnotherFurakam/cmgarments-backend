import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'employee' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id_employee: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  names: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  first_lastname: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  second_lastname: string;

  @Column()
  @Column({ type: 'varchar', length: 8, unique: true, nullable: false })
  dni: string;

  @Column({ type: 'varchar', length: 9, nullable: false })
  phone_number: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'date', nullable: false })
  date_birth: Date;

  @Column({ default: true, nullable: false })
  state: boolean;

  @ManyToOne(() => Role, (role) =>role.employee)
  @JoinColumn({name: 'id_role'}) //Como se llamará el campo en la entidad
  role: Role;

  @CreateDateColumn()
  create_at: Date;

  @CreateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  delete_at: boolean;
}
