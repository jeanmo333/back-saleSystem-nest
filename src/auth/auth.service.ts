import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import generarId from 'src/common/helpers/generarId';
import emailForgetPassword from 'src/common/helpers/emailForgetPassword';
import { ForgetDto } from './dto/forget.dto';
import { NewPassWordDto } from './dto/newPassword.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import emailRegister from 'src/common/helpers/emailRegister';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const { email, name } = userData;

    const userEmail = await this.userRepository.findOneBy({ email });
    if (userEmail) {
      throw new BadRequestException('Este email ya existe');
    }

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      // send email
      emailRegister({
        email,
        name,
        token: user.token,
      });

      return {
        message: 'Revisa tu email para confirmar tu cuenta',
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true }, //! OJO!
    });

    if (!user) throw new BadRequestException('Email o Password no valido');

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Email o Password no valido');

    if (!user.isActive) {
      throw new BadRequestException('Tu cuenta no ha sido confirmado');
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async getPerfil(user: User) {
    const { id, email, name, roles } = user;
    return { id, email, name, roles };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    const { email, name, password } = updateUserDto;

    try {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = bcrypt.hashSync(password, 10) || user.password;
      // user.isActive = isActive;
      // user.roles = roles || user.roles;
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const users = await this.userRepository.find({
        where: {
          isActive: true,
        },
        relations: {
          category: true,
          suplier: true,
        },
        take: limit,
        skip: offset,
      });

      return { users };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async confirmAccount(token: string) {
    const userConfirm = await this.userRepository.findOneBy({ token });

   if (!userConfirm) throw new NotFoundException('Token no válido');

    try {
      userConfirm.token = '';
      userConfirm.isActive = true;
      await this.userRepository.save(userConfirm);

      return { message: 'Cuenta confirmado con exito' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException("no se puede confirmar la cuenta")
    }
  }

  async forgetPassword(forgetDto: ForgetDto) {
    const { email } = forgetDto;
    const userEmail = await this.userRepository.findOneBy({ email });

    if (!userEmail) throw new NotFoundException('Este email no existe');

    try {
      userEmail.token = generarId();
      await this.userRepository.save(userEmail);

      // Enviar Email con instrucciones
      emailForgetPassword({
        email,
        name: userEmail.name,
        token: userEmail.token,
      });

      return { message: 'Revisa tu email para resetear tu password' };
    } catch (error) {
      console.log(error);
      return { message: 'can not change password' };
    }
  }

  async newPassword(token: string, newPassWordDto: NewPassWordDto) {
    const { password } = newPassWordDto;
    const userToken = await this.userRepository.findOneBy({ token });
    if (!userToken) throw new NotFoundException('token not valid');

    try {
      userToken.token = '';
      userToken.password = bcrypt.hashSync(password, 10);
      await this.userRepository.save(userToken);
      return { message: 'password modificado con exito' };
    } catch (error) {
      console.log(error);
    }
  }

  async checkToken(token: string) {
    const userToken = await this.userRepository.findOneBy({ token });
    if (userToken) {
      return { message: 'Token valid, user exist' };
    } else {
      throw new NotFoundException('token not valid');
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
