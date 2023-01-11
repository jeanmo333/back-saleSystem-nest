//import { User } from '../../products/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';
import { Suplier } from 'src/supliers/entities/suplier.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Detail } from '../../sales/entities/detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column('float', {
    default: 0,
  })
  purchase_price: number;

  @Column('float', {
    default: 0,
  })
  sale_price: number;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.product, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Suplier, (suplier) => suplier.product)
  supplier: Suplier;


  @OneToMany(() => Detail, (detail) => detail.product)
  detail?: Detail;

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkNameInsert() {
    this.name = this.name
      .toLowerCase()
  }

  @BeforeUpdate()
  checkNameUpdate() {
    this.name = this.name
      .toLowerCase()
  }
}
