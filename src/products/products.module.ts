import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SupliersModule } from '../supliers/supliers.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { AuthModule } from '../auth/auth.module';
import { CustomersModule } from '../customers/customers.module';
import { SalesModule } from '../sales/sales.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],

  imports: [
    TypeOrmModule.forFeature([ Product]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => SupliersModule),
    forwardRef(() => CustomersModule),
    forwardRef(() => SalesModule),
    forwardRef(() => AuthModule)
  ],
  exports: [
    TypeOrmModule,
    ProductsService
  ]

})
export class ProductsModule {}
