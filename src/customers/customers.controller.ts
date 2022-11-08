import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Auth()
  create(@Body() createCustomerDto: CreateCustomerDto, @GetUser() user: User) {
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto:PaginationDto, @GetUser() user: User ) {
    return this.customersService.findAll(paginationDto, user);
  }

  @Get(':term')
  @Auth()
  findOne(@Param( 'term' ) term: string, @GetUser() user: User) {
    return this.customersService.findOne(term,user);
  }



  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateCustomerDto,
    @GetUser() user: User
  ) {
    return this.customersService.update(id, updateProductDto, user);
  }


  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.customersService.remove(id, user);
  }
}
