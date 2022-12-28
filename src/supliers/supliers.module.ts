import { forwardRef, Module } from '@nestjs/common';
import { SupliersService } from './supliers.service';
import { SupliersController } from './supliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suplier } from './entities/suplier.entity';
import { SuplierAddress } from './entities/suplier-address.entity';
import { PassportModule } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SupliersController],
  providers: [SupliersService],

  imports: [
    TypeOrmModule.forFeature([Suplier, SuplierAddress]),
    forwardRef(() => AuthModule),
  ],

  exports: [SupliersService, TypeOrmModule],
})
export class SupliersModule {}
