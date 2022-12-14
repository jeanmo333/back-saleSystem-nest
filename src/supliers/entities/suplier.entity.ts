import { IsEmail, IsObject } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuplierAddress } from './suplier-address.entity';

@Entity()
export class Suplier {
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
  @OneToOne(() => SuplierAddress)
  @JoinColumn()
  address: SuplierAddress;

  @OneToMany(() => Product, (product) => product.supplier)
  product?: Product;


  @ManyToOne(() => User, (user) => user.suplier,  { eager: true })
  user: User;
 
}
