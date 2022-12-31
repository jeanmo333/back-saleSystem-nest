import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { In, Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Detail } from './entities/detail.entity';
import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class SalesService {
  private readonly logger = new Logger('SalesService');

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createSaleDto: CreateSaleDto, user: User) {
    const { details, ...rest } = createSaleDto;

    const increaseStock = async (idPro: string, quantity: number) => {
      const { stock } = await this.productRepository.findOneBy({ id: idPro  });
      const newStock = stock + quantity;
      await this.productRepository.update({ id: idPro }, { stock: newStock });
    };

    const decreaseStock = async (idPro: string, quantity: number) => {
      const { stock, name } = await this.productRepository.findOneBy({
        id: idPro,
      });
      // if (stock < quantity)
      //   throw new BadRequestException(
      //     `producto ${name} no tiene stock suficiente`,
      //   );
      const newStock = stock - quantity;
      
      try {
        await this.productRepository.update({ id: idPro }, { stock: newStock });
      } catch (error) {
       // console.log(error);
        this.handleDBExceptions(error);
      }
     
    };

    const customerDb = await this.customerRepository.findOneBy({
      name: rest.customer,
    });
    if (!customerDb) throw new NotFoundException('cliente no existe');

    const newDetailSale = details.map((detail) => {
      const detailDb = new Detail();
      detailDb.product = detail.product;
      detailDb.quantity = detail.quantity;
      decreaseStock(detail.product, detail.quantity);
      return detailDb;
    });
    await this.detailRepository.save(newDetailSale);
    
    const sale = new Sale();
    sale.customer = customerDb;
    sale.user = user;
    sale.discount = rest.discount;
    sale.total = rest.total;
    sale.details=newDetailSale

    try {
      const savedSale = await this.saleRepository.save(sale);
      return savedSale;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async numberOfSales(user: User) {
    try {
      return await this.saleRepository.count({
        where: {
          user: { id: user.id },
        },
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return await this.saleRepository.find({
        where: {
          user: { id: user.id },
        },
        relations: {
          customer: true,
          details: {
            product: true,
          },
        },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string, user: User) {
    let sale: Sale;

    sale = await this.saleRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: {
        customer: true,
        details: {
          product: true,
        },
      },
    });

    if (!sale) throw new NotFoundException('sale not found');

    if (sale.user.id !== user.id)
      throw new ForbiddenException('acceso no permitido');

    return sale;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
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
