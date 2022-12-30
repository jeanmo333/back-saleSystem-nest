import { User } from 'src/auth/entities/user.entity';
import { CreateDetailDto } from 'src/common/dtos/create-detail.dto';
import { Customer } from 'src/customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Detail } from './detail.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Column('int', {
    default: 0,
  })
  discount: number;

  @ManyToOne(() => Customer, (customer) => customer.sale, {
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @ManyToMany(() => Detail)
  @JoinTable()
  details: Detail[];

  // @ManyToMany(() => Detail)
  // @JoinTable()
  // details: Detail[];

  @ManyToOne(() => User, (user) => user.sale, { eager: true })
  user: User;



  // @ManyToOne(() => Detail, (detail) => detail.sale)
  //  details?:  Detail[];

 
}
