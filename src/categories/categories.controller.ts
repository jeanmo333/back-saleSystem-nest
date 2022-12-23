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
} from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth()
  create(@Body() createCategoryDto: CreateCategoryDto,@GetUser() user: User) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.categoriesService.findAll(paginationDto, user);
  }




  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string, @GetUser() user: User) {
    return this.categoriesService.findOne(term, user);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: User
  ) {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string,  @GetUser() user: User) {
    return this.categoriesService.remove(id, user);
  }
}
