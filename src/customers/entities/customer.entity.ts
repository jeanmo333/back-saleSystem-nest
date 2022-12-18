import { IsEmail, IsObject } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerAddress } from './customer-address.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  rut: string;

  @Column('text')
  name: string;

  @Column('text', {
    unique: true,
  })
  phone: string;

  @IsEmail()
  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    unique: true,
  })
  web: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;


  @Column('text')
  address2: string;

  @IsObject()
  @OneToOne(() => CustomerAddress)
  @JoinColumn()
  address: CustomerAddress;

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sale: Sale[];
}
