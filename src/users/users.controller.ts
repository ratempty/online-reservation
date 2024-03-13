import { UserInfo } from './utils/userInfo.decorator';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signUp.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.usersService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
    );
  }

  @Post('signUp/admin')
  async signupAdmin(@Body() signUpDto: SignUpDto) {
    return await this.usersService.signUpAdmin(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.usersService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie('authorization', `Bearer ${user.access_token}`);
    res.send('환영합니다.');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@UserInfo() user: User) {
    const point = await this.usersService.getPoint(user.id);
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      point,
    };
  }
}
