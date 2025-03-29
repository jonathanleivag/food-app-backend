import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findOneByEmail(loginAuthDto.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcryptjs.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new HttpException(
        'User or password not working',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      sub: user._id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
