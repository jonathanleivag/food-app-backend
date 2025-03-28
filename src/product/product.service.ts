import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model, ObjectId } from 'mongoose';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModule: Model<ProductDocument>,
    private readonly pusherService: PusherService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productModule.findOne({
        name: createProductDto.name,
      });

      if (product) {
        throw new Error('Product already exists');
      }
      const newProduct = await this.productModule.create(createProductDto);
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

  async findAll() {
    try {
      return await this.productModule.find();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  async findOne(id: ObjectId) {
    const product = await this.productModule.findById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async update(id: ObjectId, updateProductDto: UpdateProductDto) {
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

  async remove(id: ObjectId) {
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
}
