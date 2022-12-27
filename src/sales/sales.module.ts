import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Detail } from './entities/detail.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService],


  imports: [
    TypeOrmModule.forFeature([ Sale, Detail]),
    AuthModule,
    ProductsModule,
    CustomersModule
  ],

  exports: [
    SalesService,
    TypeOrmModule,
  ]
})
export class SalesModule {}
