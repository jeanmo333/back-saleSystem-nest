import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],

  imports: [
    TypeOrmModule.forFeature([ Customer, CustomerAddress ]),
    AuthModule
   // PassportModule.register({ defaultStrategy:'jwt'}),
  ],

  exports: [
    CustomersService,
    TypeOrmModule,
  ]

  
})
export class CustomersModule {}
