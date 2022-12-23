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
    const { category, supplier, ...rest } = createProductDto;
    rest.name = rest.name.toLowerCase();

    if (!isUUID(category)) {
      throw new BadRequestException('Categoria no valida');
    }

    if (!isUUID(supplier)) {
      throw new BadRequestException('Proveedor no valido');
    }

    const ProductFound = await this.productRepository.findOneBy({
      name: rest.name,
    });
    if (ProductFound) throw new BadRequestException('Producto ya existe');

    const categoryDb = await this.categoryRepository.findOneBy({
      id: category,
    });
    if (!categoryDb) throw new NotFoundException('categoria no existe');

    const suplierDb = await this.suplierRepository.findOneBy({ id: supplier });
    if (!suplierDb) throw new NotFoundException('proveedor no existe');

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
      product.user = user;

      const productSave = await this.productRepository.save(product);
      return { productSave, message: 'Agregado con exito' };
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
          user: { id: user.id },
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
        where: { id: term, user: { id: user.id } },
        relations: {
          category: true,
          suplier: true,
        },
      });
    } else {
      product = await this.productRepository.findOne({
        where: { name: term.toLowerCase(), user: { id: user.id } },
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

    return {product};
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { category, supplier, ...rest } = updateProductDto;
    rest.name = rest.name.toLowerCase();

    if (!isUUID(category)) {
      throw new BadRequestException('Categoria no valida');
    }

    if (!isUUID(supplier)) {
      throw new BadRequestException('Proveedor no valido');
    }

    if (!isUUID(id)) {
      throw new BadRequestException('producto no valido');
    }

    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('producto no existe');

    const categoryDb = await this.categoryRepository.findOneBy({
      id: category,
    });
    if (!categoryDb) throw new NotFoundException('categoria no existe');

    const suplierDb = await this.suplierRepository.findOneBy({ id: supplier });
    if (!suplierDb) throw new NotFoundException('proveedor no existe');

    if (product.user.id !== user.id)
      throw new ForbiddenException('acceso no permitido');

    try {
      product.name = rest.name || product.name;
      product.description = rest.description || product.description;
      product.purchase_price = rest.purchase_price || product.purchase_price;
      product.sale_price = rest.sale_price || product.sale_price;
      product.stock = rest.stock || product.stock;
      product.isActive = rest.isActive;
      product.category = categoryDb || product.category;
      product.suplier = suplierDb || product.suplier;

      await this.productRepository.update(id, product);
      const productUpdate = await this.productRepository.findOneBy({ id });
      return { productUpdate, message: 'Editado con exito' };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('product not found');

    if (product.user.id !== user.id)
      throw new ForbiddenException('acceso no permitido');

    product.isActive = false;

    try {
      await this.productRepository.delete(id);
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
