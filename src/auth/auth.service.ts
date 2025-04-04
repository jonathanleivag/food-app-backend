import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDocument, UserDocumentWithoutPassword } from '../type';
import { ObjectId } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<LoginDocument> {
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
    const userWithoutPassword = await this.userService.findOne(
      user.id as ObjectId,
    );
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<UserDocumentWithoutPassword> {
    return await this.userService.create(createUserDto);
  }
}
