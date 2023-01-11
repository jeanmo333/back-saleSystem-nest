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

  @Column('text')
  rut: string;

  @Column('text')
  name: string;

  @Column('text')
  phone: string;

  @IsEmail()
  @Column('text')
  email: string;

  @Column('text')
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
