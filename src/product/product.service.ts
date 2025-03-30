import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { PusherService } from '../pusher/pusher.service';
import { productSeedData } from './data/product.seed';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/enums/user-roles.enum';
import { ProductFindAllPaginate } from 'src/type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModule: Model<ProductDocument>,
    private readonly pusherService: PusherService,
    private readonly userService: UserService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    email: string,
  ): Promise<ProductDocument> {
    try {
      const product = await this.productModule.findOne({
        name: createProductDto.name,
      });

      if (product) {
        throw new Error('Product already exists');
      }

      const user = await this.userService.findOneByEmailAndRole(
        email,
        UserRole.ADMIN,
      );

      const newProduct = await this.productModule.create({
        ...createProductDto,
        createdBy: new Types.ObjectId(user._id),
      });

      void this.pusherService.trigger('product', 'product-created', newProduct);
      return newProduct;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<ProductFindAllPaginate | undefined> {
    try {
      const skip = (page - 1) * limit;
      const [products, total] = await Promise.all([
        this.productModule
          .find()
          .populate('createdBy', ['name', 'email', 'role'])
          .skip(skip)
          .limit(limit)
          .exec(),
        this.productModule.countDocuments(),
      ]);

      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  async findOne(id: ObjectId): Promise<ProductDocument> {
    const product = await this.productModule
      .findById(id)
      .populate('createdBy', ['name', 'email', 'role']);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async update(
    id: ObjectId,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument | undefined> {
    try {
      const product = this.productModule.findById(id);
      if (product === null || product === undefined) {
        throw new Error('Product not found');
      }
      const updatedProduct = await this.productModule.findByIdAndUpdate(
        id,
        updateProductDto,
        { new: true },
      );

      if (updatedProduct === null || updatedProduct === undefined) {
        throw new Error('Product not found');
      }

      void this.pusherService.trigger(
        'product',
        'product-updated',
        updatedProduct,
      );

      return updatedProduct;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  async remove(id: ObjectId): Promise<ProductDocument | undefined> {
    try {
      const product = await this.productModule.findById(id);
      if (product === null || product === undefined) {
        throw new Error('Product not exists');
      }
      const deletedProduct = await this.productModule.findByIdAndDelete(id);

      if (deletedProduct === null || deletedProduct === undefined) {
        throw new Error('Delete product failed');
      }

      void this.pusherService.trigger('product', 'product-deleted', product);
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  async seed(): Promise<ProductDocument[]> {
    try {
      const userAdmin = await this.userService.findOneByEmailAndRole(
        'email@jonathanleivag.cl',
        UserRole.ADMIN,
      );

      await this.productModule.deleteMany({});

      await this.productModule.insertMany(
        productSeedData.map((product) => ({
          ...product,
          createdBy: new Types.ObjectId(userAdmin._id),
        })),
      );

      const populatedProducts = await this.productModule
        .find()
        .populate('createdBy', ['name', 'email', 'role']);

      return populatedProducts;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Error seeding products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
