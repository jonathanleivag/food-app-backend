import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { HttpException } from '@nestjs/common';
import { ObjectId } from 'mongoose';

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'user',
    avatar: 'https://example.com/avatar.jpg',
    toObject: jest.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123',
      role: 'user',
      avatar: 'https://example.com/avatar.jpg',
    }),
  };

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'user',
      avatar: 'https://example.com/avatar.jpg',
    };

    it('should create a user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toBeDefined();
      expect(Object.keys(result)).not.toContain('password');
    });

    it('should throw error if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserModel.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser._id as unknown as ObjectId);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(
        service.findOne(mockUser._id as unknown as ObjectId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found by email', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.findOneByEmail('test@example.com')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto = { name: 'Updated Name' };

    it('should update a user successfully', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await service.update(
        mockUser._id as unknown as ObjectId,
        updateUserDto,
      );
      expect(result).toBeDefined();
      expect(result?.name).toBe('Updated Name');
    });

    it('should throw error if user not found for update', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(
        service.update(mockUser._id as unknown as ObjectId, updateUserDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);

      const result = await service.remove(mockUser._id as unknown as ObjectId);
      expect(result).toBeDefined();
    });

    it('should throw error if user not found for deletion', async () => {
      mockUserModel.findById.mockResolvedValue(null);
      mockUserModel.findByIdAndDelete.mockRejectedValue(
        new HttpException('User not found', 404),
      );

      await expect(
        service.remove(mockUser._id as unknown as ObjectId),
      ).rejects.toThrow(HttpException);
    });
  });
});
