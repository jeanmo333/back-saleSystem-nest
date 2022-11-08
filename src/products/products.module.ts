import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SupliersModule } from '../supliers/supliers.module';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from 'src/categories/categories.module';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],

  imports: [
    TypeOrmModule.forFeature([ Product]),
    SupliersModule, CategoriesModule,
    AuthModule
    //PassportModule.register({ defaultStrategy:'jwt'}),
  ],
  exports: [
    TypeOrmModule,
    ProductsService
  ]

})
export class ProductsModule {}
