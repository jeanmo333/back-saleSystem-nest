import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { SupliersService } from './supliers.service';
import { CreateSuplierDto } from './dto/create-suplier.dto';
import { UpdateSuplierDto } from './dto/update-suplier.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import path from 'node:path/win32';

@Controller('supliers')
export class SupliersController {
  constructor(private readonly supliersService: SupliersService) {}

  @Post()
  @Auth()
  create(@Body() createSuplierDto: CreateSuplierDto,@GetUser() user: User) {
    return this.supliersService.create(createSuplierDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto,  @GetUser() user: User) {
    return this.supliersService.findAll(paginationDto,user);
  }


  @Get(':term')
  @Auth()
  findOne(@Param( 'term' ) term: string, @GetUser() user: User) {
    return this.supliersService.findOne(term, user);
  }


  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateSuplierDto,
    @GetUser() user: User
  ) {
    return this.supliersService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.supliersService.remove(id, user);
  }
}
