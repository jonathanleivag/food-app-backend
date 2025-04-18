import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDocument } from './schema/user.schema';
import { UserDocumentWithoutPassword } from '../type';
import { ObjectId } from 'mongoose';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('seed')
  async seed(): Promise<UserDocument[]> {
    return await this.userService.seed();
  }

  @Get(':role')
  async findAllByRole(
    @Param('role') role: string,
  ): Promise<UserDocumentWithoutPassword[]> {
    return await this.userService.findAllByRole(role.toUpperCase());
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.userService.remove(id);
  }
}
