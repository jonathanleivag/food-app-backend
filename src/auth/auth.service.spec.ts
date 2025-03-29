import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'user',
      avatar: 'https://example.com/avatar.jpg',
    };

    it('should create a new user and return token', async () => {
      const mockUser = {
        _id: '1',
        ...createUserDto,
      };

      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('jwt_token');

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: mockUser.avatar,
        password: mockUser.password,
      });
    });

    it('should throw error if user already exists', async () => {
      mockUserService.findOneByEmail.mockResolvedValue({ _id: '1' });
      mockUserService.create.mockRejectedValue(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );

      await expect(service.register(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('login', () => {
    const loginAuthDto: LoginAuthDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should return user and token on successful login', async () => {
      const hashedPassword = await bcryptjs.hash(loginAuthDto.password, 10);
      const mockUser = {
        _id: '1',
        email: loginAuthDto.email,
        password: hashedPassword,
        name: 'Test User',
        role: 'user',
        avatar: 'https://example.com/avatar.jpg',
      };

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('jwt_token');

      const result = await service.login(loginAuthDto);

      expect(result).toEqual({
        token: 'jwt_token',
        user: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
          password: mockUser.password,
        },
      });
    });

    it('should throw error if user not found', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);

      await expect(service.login(loginAuthDto)).rejects.toThrowError(
        'User not found',
      );
    });
  });
});
