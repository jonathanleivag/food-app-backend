import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Model, ObjectId } from 'mongoose';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModule: Model<CartDocument>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  async create(
    createCartDto: CreateCartDto,
    email: string,
  ): Promise<CartDocument> {
    try {
      const user = await this.userService.findOneByEmail(email);
      const existingCart = await this.cartModule.findOne({
        user: user._id,
        isCompleted: false,
      });

      if (existingCart) {
        throw new Error('User already has an active cart');
      }

      const product = await this.productService.findOne(
        createCartDto.productId,
      );

      const newCart = await this.cartModule.create({
        user: user._id,
        items: [
          {
            product: product._id,
            quantity: createCartDto.quantity,
            price: product.price,
          },
        ],
        total: product.price * createCartDto.quantity,
      });

      return await newCart.populate('items.product');
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<CartDocument[]> {
    return await this.cartModule.find().populate('user items.product');
  }

  async findOne(id: ObjectId): Promise<CartDocument> {
    const cart = await this.cartModule
      .findById(id)
      .populate('user items.product');
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  async findActiveCartByUser(email: string): Promise<CartDocument | null> {
    const user = await this.userService.findOneByEmail(email);
    return await this.cartModule
      .findOne({ user: user._id, isCompleted: false })
      .populate('items.product');
  }

  async update(
    id: ObjectId,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDocument> {
    try {
      const cart = await this.cartModule.findById(id);
      if (!cart) {
        throw new Error('Cart not found');
      }

      if (cart.isCompleted) {
        throw new Error('Cannot modify completed cart');
      }

      if (
        updateCartDto.productId === null ||
        updateCartDto.productId === undefined ||
        updateCartDto.quantity === null ||
        updateCartDto.quantity === undefined ||
        updateCartDto.quantity < 1
      ) {
        throw new Error('Invalid product or quantity');
      }

      const product = await this.productService.findOne(
        updateCartDto.productId,
      );

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product._id.toString() === product._id.toString(),
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity = updateCartDto.quantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity: updateCartDto.quantity,
          price: product.price,
        });
      }

      cart.total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const updatedCart = await cart.save();
      return await updatedCart.populate('items.product');
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: ObjectId): Promise<CartDocument> {
    const cart = await this.cartModule.findByIdAndDelete(id);
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  async completeCart(id: ObjectId): Promise<CartDocument> {
    const cart = await this.cartModule.findById(id);
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }

    if (cart.isCompleted) {
      throw new HttpException('Cart already completed', HttpStatus.BAD_REQUEST);
    }

    cart.isCompleted = true;
    return await cart.save();
  }

  async removeItemFromCart(
    cartId: ObjectId,
    productId: string,
  ): Promise<CartDocument> {
    const cart = await this.cartModule.findById(cartId);
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }

    if (cart.isCompleted) {
      throw new HttpException(
        'Cannot modify completed cart',
        HttpStatus.BAD_REQUEST,
      );
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return await cart.save();
  }
}
