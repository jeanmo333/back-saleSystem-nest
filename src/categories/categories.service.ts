import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const { name } = createCategoryDto;

    const categoryName = await this.categoryRepository.findOneBy({ name });
    if (categoryName)
      throw new BadRequestException(`category with name: ${name} already exit`);
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      category.user = user;
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      return await this.categoryRepository.find({
        where: {
          isActive: true,
          user: { id: user.id },
        },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string, user: User) {
    let category: Category;

    if (isUUID(term)) {
      category = await this.categoryRepository.findOne({
        where: { id: term,  user: { id: user.id } },
      });
    } else {
      category = await this.categoryRepository.findOne({
        where: { name: term.toLowerCase(),  user: { id: user.id } },
      });
    }

    if (!category) throw new NotFoundException('category not found');

    if (category.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');

    if (category.isActive === false)
      throw new NotFoundException('category is not active');

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: User) {
    const { name, description, isActive } = updateCategoryDto;
   


    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('category not found');

    if (category.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');

    category.name = name || category.name;
    category.description = description || category.description;
    category.isActive = isActive;

    try {
      await this.categoryRepository.update(id, category);
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('category not found');

    if (category.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');

    category.isActive = false;

    try {
      await this.categoryRepository.update(id, category);
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
