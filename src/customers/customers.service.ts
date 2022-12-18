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
import { validate as isUUID } from 'uuid';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerAddress } from './entities/customer-address.entity';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger('CustomersService');

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(CustomerAddress)
    private readonly addressRepository: Repository<CustomerAddress>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, user: User) {
    const { rut, phone, email, web } = createCustomerDto;

    const customerRut = await this.customerRepository.findOneBy({ rut });
    if (customerRut)
      throw new BadRequestException(`customer with rut: ${rut} already exit`);

    const customerPhone = await this.customerRepository.findOneBy({ phone });
    if (customerPhone)
      throw new BadRequestException(
        `customer with phone: ${phone} already exit`,
      );

    const customerEmail = await this.customerRepository.findOneBy({ email });
    if (customerEmail)
      throw new BadRequestException(
        `customer with email: ${email} already exit`,
      );

    const customerWeb = await this.customerRepository.findOneBy({ web });
    if (customerWeb)
      throw new BadRequestException(`customer with web: ${web} already exit`);

    try {
      const { address, ...rest } = createCustomerDto;

      // const newCustomerAddress = new CustomerAddress();

      // newCustomerAddress.calle = address.calle;
      // newCustomerAddress.numero = address.numero;
      // newCustomerAddress.ciudad = address.ciudad;
      // newCustomerAddress.comuna = address.comuna;

      // await this.addressRepository.save(newCustomerAddress);

      const customer = new Customer();

      customer.rut = rest.rut;
      customer.name = rest.name;
      customer.email = rest.email;
      customer.phone = rest.phone;
      customer.web = rest.web;
      customer.isActive = rest.isActive;
      customer.address2 = rest.address2;
      // customer.address = newCustomerAddress;
      customer.user = user;

      const customerSave = await this.customerRepository.save(customer);

      return { customerSave, message: 'Agregado con exito' };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const customers = await this.customerRepository.find({
        where: {
          isActive: true,
          user: { id: user.id },
        },
        relations: {
          address: true,
        },
        take: limit,
        skip: offset,
      });

      return { customers };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string, user: User) {
    let customer: Customer;

    if (isUUID(term)) {
      customer = await this.customerRepository.findOne({
        where: { id: term, user: { id: user.id } },
        relations: {
          address: true,
        },
      });
    } else {
      customer = await this.customerRepository.findOne({
        where: { name: term.toLowerCase(), user: { id: user.id } },
        relations: {
          address: true,
        },
      });
    }

    if (!customer) throw new NotFoundException('customer not found');

    if (customer.user.id !== user.id)
      throw new ForbiddenException('acceso no permitido');

    if (customer.isActive === false)
      throw new NotFoundException('customer is not active');

    return { customer };
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, user: User) {
    const { address, ...rest } = updateCustomerDto;
    rest.name = rest.name.toLowerCase();

    // const newAddress = new CustomerAddress();
    // newAddress.calle = address.calle || newAddress.calle;
    // newAddress.numero = address.numero || newAddress.numero;
    // newAddress.ciudad = address.ciudad || newAddress.ciudad ;
    // newAddress.comuna = address.comuna || newAddress.comuna;

    // await this.addressRepository.save(newAddress);

    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException('customer not found');

    if (customer.user.id !== user.id)
      throw new ForbiddenException('acceso no permitido');

    customer.name = rest.name || customer.name;
    customer.email = rest.email || customer.email;
    customer.phone = rest.phone || customer.phone;
    customer.rut = rest.rut || customer.rut;
    customer.web = rest.web || customer.web;
    customer.isActive = rest.isActive;
    customer.address2 = rest.address2;
    // customer.address = newAddress || customer.address;

    try {
      await this.customerRepository.update(id, customer);
      const customerUpdate = await this.customerRepository.findOneBy({ id });
      return { customerUpdate, message: 'Editado con exito' };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException('customer not found');

    if (customer.user.id !== user.id)
      throw new ForbiddenException('acceso no permitido');

    customer.isActive = false;

    try {
      await this.customerRepository.update(id, customer);
      return customer;
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
