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
import { CreateSuplierDto } from './dto/create-suplier.dto';
import { UpdateSuplierDto } from './dto/update-suplier.dto';
import { SuplierAddress } from './entities/suplier-address.entity';
import { Suplier } from './entities/suplier.entity';

@Injectable()
export class SupliersService {
  private readonly logger = new Logger('SupliersService');

  constructor(
    @InjectRepository(Suplier)
    private readonly suplierRepository: Repository<Suplier>,

    @InjectRepository(SuplierAddress)
    private readonly suplierAddressRopository: Repository<SuplierAddress>,
  ) {}

  async create(createSuplierDto: CreateSuplierDto, user: User) {
    const { address, ...rest } = createSuplierDto;

    const suplierRut = await this.suplierRepository.findOneBy({
      rut: rest.rut,
    });
    if (suplierRut)
      throw new BadRequestException(
        `suplier with rut: ${rest.rut} already exit`,
      );

    const suplierTelefono = await this.suplierRepository.findOneBy({
      phone: rest.phone,
    });
    if (suplierTelefono)
      throw new BadRequestException(
        `suplier with phone: ${rest.phone} already exit`,
      );

    const suplierEmail = await this.suplierRepository.findOneBy({
      email: rest.email,
    });
    if (suplierEmail)
      throw new BadRequestException(
        `suplier with email: ${rest.email} already exit`,
      );

    const suplierWeb = await this.suplierRepository.findOneBy({
      web: rest.web,
    });
    if (suplierWeb)
      throw new BadRequestException(
        `suplier with web: ${rest.web} already exit`,
      );

    try {
      const newAddressSuplier = new SuplierAddress();
      
      newAddressSuplier.calle = address.calle;
      newAddressSuplier.numero = address.numero;
      newAddressSuplier.ciudad = address.ciudad;
      newAddressSuplier.comuna = address.comuna;

      await this.suplierAddressRopository.save(newAddressSuplier);

      const suplier = new Suplier();

      suplier.rut = rest.rut;
      suplier.name = rest.name;
      suplier.email = rest.email;
      suplier.phone = rest.phone;
      suplier.web = rest.web;
      suplier.isActive = rest.isActive;
      suplier.address = newAddressSuplier;
      suplier.user=user;

      await this.suplierRepository.save(suplier);
      return { suplier };
     
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
    const suppliers = await this.suplierRepository.find({
        where: {
          isActive: true,
          user: { id: user.id },
        },
        relations: {
          address: true
        },
        take: limit,
        skip: offset,
      });

      return {suppliers}
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string, user: User) {
    let suplier: Suplier;
   
      if (isUUID(term)) {
        suplier = await this.suplierRepository.findOne({
          where: { id: term,  user: { id: user.id } },
          relations: {
            address: true
          },
        });
      } else {
        suplier = await this.suplierRepository.findOne({
          where: { name: term.toLowerCase(),  user: { id: user.id } },
          relations: {
            address: true
          },
        });
      }


      if (!suplier) throw new NotFoundException('suplier not found');

      if (suplier.user.id !== user.id)
      throw new ForbiddenException('acceso no permitido');
  
      if (suplier.isActive === false)
      throw new NotFoundException('suplier is not active');

      return suplier;
   
  }

  async update(id: string, updateSplierDto: UpdateSuplierDto, user: User ) {
    const { address, ...rest } = updateSplierDto;
    rest.name = rest.name.toLowerCase();

    const suplier = await this.suplierRepository.findOneBy({ id });
    if (!suplier) throw new NotFoundException('suplier not found');

    if (suplier.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');


    const newAddress = new SuplierAddress();
    newAddress.calle = address.calle || newAddress.calle;
    newAddress.numero = address.numero || newAddress.numero;
    newAddress.ciudad = address.ciudad || newAddress.ciudad;
    newAddress.comuna = address.comuna || newAddress.comuna;

    await this.suplierAddressRopository.save(newAddress);

    suplier.name = rest.name || suplier.name;
    suplier.email = rest.email || suplier.email;
    suplier.phone = rest.phone || suplier.phone;
    suplier.rut = rest.rut ||suplier.rut ;
    suplier.web = rest.web || suplier.web;
    suplier.isActive = rest.isActive;
    suplier.address = newAddress || suplier.address;

    try {
      await this.suplierRepository.update(id, suplier);
      return suplier;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const suplier = await this.suplierRepository.findOneBy({ id });

    if (!suplier) throw new NotFoundException('suplier not found');

    if (suplier.user.id !== user.id)
    throw new ForbiddenException('acceso no permitido');

    suplier.isActive = false;

    try {
      await this.suplierRepository.update(id, suplier);
      return suplier;
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
