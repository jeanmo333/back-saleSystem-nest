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
  @OneToOne(() => SuplierAddress)
  @JoinColumn()
  address: SuplierAddress;

  @OneToMany(() => Product, (product) => product.suplier)
  product?: Product;


  @ManyToOne(() => User, (user) => user.suplier,  { eager: true })
  user: User;
 
}
