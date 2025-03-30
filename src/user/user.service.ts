import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { userSeed } from './data/user.seed';
import { UserDocumentWithoutPassword } from '../type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModule: Model<UserDocument>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<UserDocumentWithoutPassword> {
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

  async findAll(): Promise<UserDocumentWithoutPassword[]> {
    return await this.userModule.find().select('-password');
  }

  async findOne(id: ObjectId): Promise<UserDocumentWithoutPassword> {
    const user = await this.userModule.findById(id).select('-password');

    if (user === null || user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModule.findOne({ email });

    if (user === null || user === undefined) {
      throw new HttpException(
        'User or password not working',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findOneByEmailAndRole(
    email: string,
    role: string,
  ): Promise<UserDocument> {
    const user = await this.userModule.findOne({ email, role });
    if (user === null || user === undefined) {
      throw new HttpException(
        'User not found or role not working',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(
    id: ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocumentWithoutPassword> {
    const user = await this.userModule.findById(id);
    if (user === null || user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.userModule
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .select('-password');

    if (!updatedUser) {
      throw new HttpException('Failed to update user', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  async remove(id: ObjectId): Promise<UserDocumentWithoutPassword> {
    const user = await this.userModule.findById(id).select('-password');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userModule.findByIdAndDelete(id);
    return user;
  }

  async seed(): Promise<UserDocument[]> {
    await this.userModule.deleteMany({});
    const seedUsers = await this.userModule.insertMany(userSeed);
    return seedUsers;
  }
}
