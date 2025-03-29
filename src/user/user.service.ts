import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModule: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModule.findOne({ email: createUserDto.email });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const newUser = await this.userModule.create(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, _id, ...result } = newUser.toObject();
    return result;
  }

  async findAll() {
    return await this.userModule.find();
  }

  async findOne(id: ObjectId) {
    const user = await this.userModule.findById(id);

    if (user === null || user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModule.findOne({ email });

    if (user === null || user === undefined) {
      throw new HttpException(
        'User or password not working',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto) {
    const user = await this.userModule.findById(id);
    if (user === null || user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.userModule.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async remove(id: ObjectId) {
    const user = this.userModule.findById(id);
    if (user === null || user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userModule.findByIdAndDelete(id);
    return user;
  }
}
