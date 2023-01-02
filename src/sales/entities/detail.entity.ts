import {
  Column,
  Entity,
  FindOperator,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { User } from 'src/auth/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateDetailDto } from '../dto/create-detail.dto';

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
  product?:  string;

  // @ManyToMany(() => Sale, (sale) => sale.details)
  // @JoinTable()
  // sale: Sale;

  // @ManyToMany(() => Sale, (sale) => sale.details)
  // sale: Sale

  // @OneToMany(() => Sale, (sale) => sale.details)
  // sale?: Sale;




}
