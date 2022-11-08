import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Suplier } from 'src/supliers/entities/suplier.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Suplier)
    private readonly suplierRepository: Repository<Suplier>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { category, suplier, ...rest } = createProductDto;
    rest.name = rest.name.toLowerCase();

    if (!isUUID(category)) {
      throw new BadRequestException(`category with id: ${category} not valid`);
    }

    if (!isUUID(suplier)) {
      throw new BadRequestException(`suplier with id: ${suplier} not valid`);
    }

    const ProductFound = await this.productRepository.findOneBy({
      name: rest.name,
    });
    if (ProductFound)
      throw new BadRequestException(
        `product with name: ${rest.name} already exit`,
      );

    const categoryDb = await this.categoryRepository.findOneBy({
      id: category,
    });
    if (!categoryDb) throw new NotFoundException(`category not found`);

    const suplierDb = await this.suplierRepository.findOneBy({ id: suplier });
    if (!suplierDb) throw new NotFoundException(`suplier not found`);

    try {
      const product = new Product();
      product.name = rest.name;
      product.description = rest.description;
      product.purchase_price = rest.purchase_price;
      product.sale_price = rest.sale_price;
      product.stock = rest.stock;
      product.isActive = rest.isActive;
      product.category = categoryDb;
      product.suplier = suplierDb;
      product.user=user;
      await this.productRepository.save(product);

      return  product ;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return await this.productRepository.find({
        where: {
          isActive: true,
          user: { id: user.id }
        },
        relations: {
          category: true,
          suplier: true,
        },
        take: limit,
        skip: offset,
      });

      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string, user: User) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        where: { id: term,  user: { id: user.id } },
        relations: {
          category: true,
          suplier: true,
        },
      });
    } else {
      product = await this.productRepository.findOne({
        where: { name: term.toLowerCase(),  user: { id: user.id } },
        relations: {
          category: true,
          suplier: true,
        },
      });
    }

    if (!product) throw new NotFoundException('product not found');

    if (product.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');

    if (product.isActive === false)
      throw new NotFoundException('product is not active');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { category, suplier, ...rest } = updateProductDto;
    rest.name = rest.name.toLowerCase();

    if (!isUUID(category)) {
      throw new BadRequestException(`category with id: ${category} not valid`);
    }

    if (!isUUID(suplier)) {
      throw new BadRequestException(`suplier with id: ${suplier} not valid`);
    }

    if (!isUUID(id)) {
      throw new BadRequestException(`product with id: ${id} not valid`);
    }

    const productId = await this.productRepository.findOneBy({ id });
    if (!productId)
      throw new NotFoundException(`product with id: ${id} not found`);

    const categoryDb = await this.categoryRepository.findOneBy({
      id: category,
    });
    if (!categoryDb) throw new NotFoundException(`category not found`);

    const suplierDb = await this.suplierRepository.findOneBy({ id: suplier });
    if (!suplierDb) throw new NotFoundException(`suplier not found`);


    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('product not found');


    if (product.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');

    try {
      product.name = rest.name || product.name;
      product.description = rest.description || product.description;
      product.purchase_price = rest.purchase_price || product.purchase_price;
      product.sale_price = rest.sale_price || product.sale_price;
      product.stock = rest.stock || product.stock;
      product.isActive = rest.isActive ;
      product.category = categoryDb || product.category;
      product.suplier = suplierDb || product.suplier;
     

      await this.productRepository.update(id, product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string,  user: User) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('product not found');

    if (product.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');

    product.isActive = false;

    try {
      await this.productRepository.update(id, product);
      return product;
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
