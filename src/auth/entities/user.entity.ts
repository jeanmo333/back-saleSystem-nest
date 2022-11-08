//import { Product } from 'src/products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { Suplier } from '../../supliers/entities/suplier.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Sale } from '../../sales/entities/sale.entity';
import generarId from 'src/common/helpers/generarId';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  name: string;

  @Column('bool', {
    default: false,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];


  @Column('text', {
    default: generarId(),
  })
  token: string

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @OneToMany(() => Category, (category) => category.user)
  category: Product;

  @OneToMany(() => Customer, (customer) => customer.user)
  customer: Customer;


  @OneToMany(() => Sale, (sale) => sale.user)
  sale: Sale;


  @OneToMany(() => Suplier, (suplier) => suplier.user)
  suplier: Suplier;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

}
