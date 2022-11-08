import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Detail } from './entities/detail.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService],


  imports: [
    TypeOrmModule.forFeature([ Sale, Detail ]),
    AuthModule
    //PassportModule.register({ defaultStrategy:'jwt'}),
  ],

  exports: [
    SalesService,
    TypeOrmModule,
  ]
})
export class SalesModule {}
