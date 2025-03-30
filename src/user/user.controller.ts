import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDocument } from './schema/user.schema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('seed')
  async seed(): Promise<UserDocument[]> {
    return await this.userService.seed();
  }
}
