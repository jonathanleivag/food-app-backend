import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { PusherService } from '../pusher/pusher.service';
import { ObjectId } from 'mongoose';

describe('ProductController', () => {
  let controller: ProductController;

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

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPusherService = {
    trigger: jest.fn(() => Promise.resolve(undefined)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: getModelToken(Product.name),
          useValue: {},
        },
        {
          provide: PusherService,
          useValue: mockPusherService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  describe('create', () => {
    it('should create a product', async () => {
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

      mockProductService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct];
      mockProductService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();
      expect(result).toEqual(products);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      mockProductService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(
        mockProduct.id as unknown as ObjectId,
      );
      expect(result).toEqual(mockProduct);
      expect(mockProductService.findOne).toHaveBeenCalledWith(
        mockProduct.id as unknown as ObjectId,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { price: 15.99 };
      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(
        mockProduct.id as unknown as ObjectId,
        updateProductDto,
      );
      expect(result).toEqual(updatedProduct);
      expect(mockProductService.update).toHaveBeenCalledWith(
        mockProduct.id as unknown as ObjectId,
        updateProductDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductService.remove.mockResolvedValue(mockProduct);

      const result = await controller.remove(
        mockProduct.id as unknown as ObjectId,
      );
      expect(result).toEqual(mockProduct);
      expect(mockProductService.remove).toHaveBeenCalledWith(
        mockProduct.id as unknown as ObjectId,
      );
    });
  });
});
