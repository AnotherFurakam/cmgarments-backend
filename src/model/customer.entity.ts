import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sale } from "./sale.entity";

@Entity({name: 'customer'})
export class Customer {

  @PrimaryGeneratedColumn('uuid')
  id_customer: string;

  @Column({type: 'varchar', length: 50, nullable: false})
  names: string;

  @Column({type: 'varchar', length: 50, nullable: false})
  first_lastname: string;

  @Column({type: 'varchar', length: 50, nullable: false})
  second_lastname: string;

  @Column({type: 'char', length: 8, nullable: false, unique: true})
  dni: string;

  @Column({type: 'char', length: 9, nullable: false})
  phone_number: string;

  @Column({type: 'varchar', length: 50, nullable: false, unique: true})
  email: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @Column({type: 'varchar', length: 225, nullable: false})
  password: string;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sale: Sale[];

}