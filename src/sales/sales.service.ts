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

    const customerDb = await this.customerRepository.findOneBy({
      name: rest.customer,
    });
    if (!customerDb) throw new NotFoundException('cliente no existe');

    /************************************************************* */

    // const product_names = details.map(async (detail) => (await detail).product);

    details.map(async (detailReq) => {
      const sale = new Sale();
      sale.customer = customerDb;
      //sale.details = detailsToSave;
      sale.user = user;
      //const conversation = await Conversation.find({ where: { id: conversationId } })
      const productsDb = await this.productRepository.findBy({
        name: In([detailReq.product]),
      });
      if (!productsDb)
        throw new NotFoundException('hay un producto que no existe no existe');
      const detailDb = new Detail();
      (detailDb.quantity = detailReq.quantity), (detailDb.product = productsDb);
      detailDb.sale = sale;

      //return detailsToSave;

      try {
        await this.detailRepository.save(detailDb);
        //  await this.saleRepository.save(sale);
        //delete sale.user;
        return detailDb;
      } catch (error) {
        console.log(error);
        // this.handleDBExceptions(error);
      }
    });

    // const productsDb = await this.productRepository.findBy({ name: In([product_names]) });
    // if (!productsDb) throw new NotFoundException('proveedor no existe');

    //console.log(productsDb)
    // const newDetailSale = details.map((detail) =>
    //   this.detailRepository.create(detail),
    // );
    // await this.detailRepository.save(detailsToSave);

    /************************************************************* */

    //  const newDetailSale = details.map((detail) => this.detailRepository.create(detail));
    //  await this.detailRepository.save(newDetailSale);

    // const sale = this.saleRepository.create({
    //   ...rest,
    //   details: newDetailSale,
    //   user
    // });
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
