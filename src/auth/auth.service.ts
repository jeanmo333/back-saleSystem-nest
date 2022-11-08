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
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import emailRegistro from 'src/common/helpers/emailRegister';
import generarId from 'src/common/helpers/generarId';
import emailForgetPassword from 'src/common/helpers/emailForgetPassword';
import { ForgetDto } from './dto/forget.dto';
import { NewPassWordDto } from './dto/newPassword.dto';


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
    const { email, name  } = userData;

    const userEmail = await this.userRepository.findOneBy({ email });
    if(userEmail){
      throw new BadRequestException('Email already exist')
    }


    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });


     
      await this.userRepository.save(user);
      delete user.password;

      // send email
      emailRegistro({
        email,
        name,
        token: user.token,
      });

      return {
        message: "check your email and confirm your account",
        ...user,
        token: this.getJwtToken({ id: user.id }),
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

    if (!user)
      throw new BadRequestException('Email or Password are not valid (email)');

   
    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Email or Password are not valid (password)');


      if (!user.isActive) {
        throw new BadRequestException('Your account has not been confirmed');
      }
  

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async getPerfil(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
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

  async confirmAccount(token: string) {
    const userConfirm = await this.userRepository.findOneBy({ token });

    if (!userConfirm) throw new NotFoundException('Token no válido');

    try {
      userConfirm.token = '';
      userConfirm.isActive = true;
      await this.userRepository.save(userConfirm);

      return { message: 'Account Confirm successfuly' };
    } catch (error) {
      console.log(error);
      return { message: 'can not comfirm account' };
     
    }
  }




async forgetPassword (forgetDto: ForgetDto) {
 const {email} = forgetDto
  const userEmail = await this.userRepository.findOneBy({ email });
  
    if (!userEmail) throw new NotFoundException('email not exist');
  
    try {
      userEmail.token = generarId();
      await this.userRepository.save(userEmail);
  
      // Enviar Email con instrucciones
      emailForgetPassword({
        email,
        name: userEmail.name,
        token: userEmail.token,
      });
  
      return { message: 'check your email, and reset password' };
    } catch (error) {
      console.log(error);
      return { message: 'can not change password' };
    }
  };



    async newPassword (token: string, newPassWordDto: NewPassWordDto) {

    const { password} = newPassWordDto;
    const userToken = await this.userRepository.findOneBy({ token });
    if (!userToken) throw new NotFoundException('token not valid');
  
    try {
      userToken.token = '';
     userToken.password = bcrypt.hashSync(password, 10)
      await this.userRepository.save(userToken);
      return { message: 'password change successfuly' };
    } catch (error) {
      console.log(error);
    }
  };





    async checkToken (token: string) {
      const userToken = await this.userRepository.findOneBy({ token });
      if (userToken) {
       return {message: 'Token valid, user exist'} 
      }else{
        throw new NotFoundException('token not valid');
      };
  
  };



  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
