import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],

  imports: [
    TypeOrmModule.forFeature([ Category]),
    AuthModule
  ],
  exports: [
    TypeOrmModule,
    CategoriesService
  ]

})
export class CategoriesModule {}
