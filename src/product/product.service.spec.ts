import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { ObjectId } from 'mongoose';
import { PusherService } from '../pusher/pusher.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let pusherService: PusherService;

  const mockProduct = {
    id: '507f1f77bcf86cd799439011',
    name: 'Test Product',
    price: 10.99,
    description: 'Test Description',
    category: 'Test Category',
    imageUrl: 'http://test.com/image.jpg',
    isAvailable: true,
    ingredients: ['ingredient1', 'ingredient2'],
    baseIngredients: ['base1', 'base2'],
    extraIngredients: ['extra1', 'extra2'],
    preparationTime: 15,
    calories: 300,
  };

  const mockPusherService = {
    trigger: jest.fn(() => Promise.resolve(undefined)),
  };

  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(), // Add this
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: mockModel,
        },
        {
          provide: PusherService,
          useValue: mockPusherService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    pusherService = module.get<PusherService>(PusherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto = {
        name: mockProduct.name,
        price: mockProduct.price,
        description: mockProduct.description,
        category: mockProduct.category,
        imageUrl: mockProduct.imageUrl,
        isAvailable: mockProduct.isAvailable,
        ingredients: mockProduct.ingredients,
        baseIngredients: mockProduct.baseIngredients,
        extraIngredients: mockProduct.extraIngredients,
        preparationTime: mockProduct.preparationTime,
        calories: mockProduct.calories,
      };

      mockModel.findOne.mockResolvedValue(null);
      mockModel.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockProduct);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(pusherService.trigger).toHaveBeenCalledWith(
        'product',
        'product-created',
        mockProduct,
      );
    });

    it('should throw error if product already exists', async () => {
      const createProductDto = {
        name: mockProduct.name,
        price: mockProduct.price,
        description: mockProduct.description,
        category: mockProduct.category,
        imageUrl: mockProduct.imageUrl,
        isAvailable: mockProduct.isAvailable,
        ingredients: mockProduct.ingredients,
        baseIngredients: mockProduct.baseIngredients,
        extraIngredients: mockProduct.extraIngredients,
        preparationTime: mockProduct.preparationTime,
        calories: mockProduct.calories,
      };

      mockModel.findOne.mockResolvedValue(mockProduct);

      await expect(service.create(createProductDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      const mockExec = jest.fn().mockRejectedValue(mockError);
      const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });

      mockModel.find.mockReturnValue({ skip: mockSkip });
      mockModel.countDocuments.mockRejectedValue(mockError);

      await expect(service.findAll(1, 10)).rejects.toThrow('Database error');
    });

    it('should return paginated products', async () => {
      const mockProducts = [{ name: 'Test Product' }];
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockProducts),
          }),
        }),
      });
      mockModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result).toBeDefined();
      expect(result?.data).toEqual(mockProducts);
      expect(result?.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      mockModel.findById.mockResolvedValue(mockProduct);

      const result = await service.findOne(
        mockProduct.id as unknown as ObjectId,
      );
      expect(result).toEqual(mockProduct);
    });

    it('should throw error if product not found', async () => {
      mockModel.findById.mockRejectedValue(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );

      await expect(
        service.findOne(mockProduct.id as unknown as ObjectId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updatedProduct = { ...mockProduct, price: 15.99 };
      mockModel.findById.mockResolvedValue(mockProduct);
      mockModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      const result = await service.update(
        mockProduct.id as unknown as ObjectId,
        updatedProduct,
      );
      expect(result).toEqual(updatedProduct);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(pusherService.trigger).toHaveBeenCalledWith(
        'product',
        'product-updated',
        updatedProduct,
      );
    });

    it('should throw error if product not found for update', async () => {
      mockModel.findById.mockResolvedValue(null);
      mockModel.findByIdAndUpdate.mockRejectedValue(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );

      await expect(
        service.update(mockProduct.id as unknown as ObjectId, mockProduct),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockModel.findById.mockResolvedValue(mockProduct);
      mockModel.findByIdAndDelete.mockResolvedValue(mockProduct);

      const result = await service.remove(
        mockProduct.id as unknown as ObjectId,
      );
      expect(result).toEqual(mockProduct);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(pusherService.trigger).toHaveBeenCalledWith(
        'product',
        'product-deleted',
        mockProduct,
      );
    });

    it('should throw error if product not found for deletion', async () => {
      mockModel.findById.mockResolvedValue(null);

      await expect(
        service.remove(mockProduct.id as unknown as ObjectId),
      ).rejects.toThrow(HttpException);
    });
  });
});
