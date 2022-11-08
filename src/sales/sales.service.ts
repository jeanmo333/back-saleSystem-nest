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
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Detail } from './entities/detail.entity';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesService {
  private readonly logger = new Logger('SalesService');

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
  ) {}

  async create(createSaleDto: CreateSaleDto,  user: User) {
    const { details, ...rest } = createSaleDto;
    const sale = this.saleRepository.create({
      ...rest,
      details: details.map((detail) => this.detailRepository.create(detail)),
      user
    });
    try {
      await this.saleRepository.save(sale);
      //delete sale.user;
      return sale;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return await this.saleRepository.find({
        where: {
          user: { id: user.id }
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
      where: { id,  user: { id: user.id } },
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
