import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  SetMetadata,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { AuthService } from './auth.service';
import { RawHeaders, GetUser, Auth } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto';
import { ForgetDto } from './dto/forget.dto';
import { NewPassWordDto } from './dto/newPassword.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }



  @Get('dashboard')
  @Auth()
  dashboard( @GetUser() user: User) {
    return this.authService.dashboard(user);
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('profile')
  @Auth()
  getPerfil(@GetUser() user: User) {
    return this.authService.getPerfil(user);
  }

  @Patch('perfil/update')
  @Auth()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.authService.update(updateUserDto, user);
  }

  @Get('confirmAccount/:token')
  confirmAccount(@Param('token') token: string) {
    return this.authService. confirmAccount(token);
  }


  @Post('forgetPassword')
  forgetPassword(@Body() forgetDto: ForgetDto) {
    return this.authService.forgetPassword(forgetDto);
  }



  @Post('newPassword/:token')
  newPassword (
    @Param('token') token: string,
    @Body()  newPassWordDto : NewPassWordDto,
  ) {
    return this.authService.newPassword(token, newPassWordDto);
  }


  @Get('checkToken/:token')
  checkToken(@Param('token') token: string) {
    return this.authService.checkToken(token);
  }


/*********************************Admin********************************************** */
  
@Post('admin/register-user')
@Auth(ValidRoles.admin)
createUserAdmin(@Body() createUserDto: CreateUserDto) {
  return this.authService.createByAdmin(createUserDto);
}


  @Get('admin/users')
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }


  @Get('admin/users/:term')
  @Auth(ValidRoles.admin)
  findOneByAdmin(@Param( 'term' ) term: string) {
    return this.authService.findOneByAdmin(term);
  }


  @Patch('admin/update-user/:id')
  @Auth(ValidRoles.admin)
  updateByAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateUserDto,
  ) {
    return this.authService.updateByAdmin(id, updateProductDto);
  }


  @Delete('admin/delete-user/:id')
  @Auth(ValidRoles.admin)
  removeByAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.removeByAdmin(id);
  }

 
}
