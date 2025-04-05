import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import {
  LoginDocument,
  RequestWithUser,
  UserDocumentWithoutPassword,
} from '../type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto): Promise<LoginDocument> {
    return this.authService.login(loginAuthDto);
  }

  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDocumentWithoutPassword> {
    return this.authService.register(createUserDto);
  }

  @Get('revalidate')
  revalidate(@Query('token') token: string): Promise<LoginDocument> {
    return this.authService.revalidate(token);
  }

  @Get('test')
  @UseGuards(AuthGuard)
  test(@Request() req: RequestWithUser): string {
    console.log('🚀 ~ AuthController ~ test ~ req:', req.user);
    return 'test';
  }
}
