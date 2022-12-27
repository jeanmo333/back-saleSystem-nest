import {
  Column,
  Entity,
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
  product?: Product[];

  @ManyToMany(() => Sale, (sale) => sale.details)
  sale: Sale


  // @ManyToOne(() => Sale, (sale) => sale.details, {
  //   cascade: true,
  // })
  // sale?: Sale;


}
