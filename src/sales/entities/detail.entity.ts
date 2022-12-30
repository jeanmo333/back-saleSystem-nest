import {
  Column,
  Entity,
  FindOperator,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { User } from 'src/auth/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Detail {
 
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('int', {
    default: 0,
  })
  quantity?: number;

  @ManyToOne(() => Product, (product) => product.detail, {
    onDelete: 'CASCADE',
  })
  product?:  string | FindOperator<string>;

  // @ManyToMany(() => Sale, (sale) => sale.details)
  // sale: Sale

  // @OneToMany(() => Sale, (sale) => sale.details)
  // sale?: Sale;




}
