import { forwardRef, Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SupliersModule } from 'src/supliers/supliers.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { SalesModule } from 'src/sales/sales.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],

  imports: [
    TypeOrmModule.forFeature([ Customer, CustomerAddress ]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => SupliersModule),
    forwardRef(() => CustomersModule),
    forwardRef(() => SalesModule),
    forwardRef(() => AuthModule)
  ],

  exports: [
    CustomersService,
    TypeOrmModule,
  ]

  
})
export class CustomersModule {}
