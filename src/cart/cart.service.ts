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
        const id = existingCart._id as ObjectId;
        return await this.update(
          id,
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          { ...createCartDto, id: id.toString() },
          true,
        );
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
            extra: createCartDto.extra,
            ingredients: createCartDto.ingredients,
            extraIngredients: createCartDto.extraIngredients,
            price: product.price,
          },
        ],
        total: product.price * createCartDto.quantity + createCartDto.extra,
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
    created: boolean = false,
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
        updateCartDto.id === null ||
        updateCartDto.id === undefined ||
        updateCartDto.productId === null ||
        updateCartDto.productId === undefined ||
        updateCartDto.quantity === null ||
        updateCartDto.quantity === undefined ||
        updateCartDto.quantity < 1 ||
        updateCartDto.ingredients === null ||
        updateCartDto.ingredients === undefined ||
        updateCartDto.ingredients.length < 1 ||
        updateCartDto.ingredients.length === 0 ||
        updateCartDto.extra === null ||
        updateCartDto.extra === undefined ||
        updateCartDto.extra < 0
      ) {
        throw new Error('Invalid product or quantity');
      }

      const product = await this.productService.findOne(
        updateCartDto.productId,
      );

      if (created) {
        cart.items.push({
          product: product._id,
          quantity: updateCartDto.quantity,
          ingredients: updateCartDto.ingredients,
          extraIngredients: updateCartDto.extraIngredients,
          extra: updateCartDto.extra,
          price: product.price,
        });

        cart.total = cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity + (item.extra || 0),
          0,
        );

        const updatedCart = await cart.save();
        return await updatedCart.populate('items.product');
      } else {
        const existingItemIndex = cart.items.findIndex(
          (item) => item._id!.toString() === updateCartDto.id,
        );

        if (existingItemIndex === -1) {
          throw new Error('Item not found in cart');
        }

        const updatedCart = await this.cartModule
          .findOneAndUpdate(
            { _id: id, 'items._id': updateCartDto.id },
            {
              $set: {
                'items.$.quantity': updateCartDto.quantity,
                'items.$.extra': updateCartDto.extra,
                'items.$.ingredients': updateCartDto.ingredients,
                'items.$.extraIngredients': updateCartDto.extraIngredients,
              },
            },
            { new: true },
          )
          .populate('items.product');

        if (!updatedCart) {
          throw new Error('Failed to update cart');
        }

        // Recalculate total after update
        updatedCart.total = updatedCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity + (item.extra || 0),
          0,
        );
        await updatedCart.save();

        return updatedCart;
      }
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
    idItem: string,
    email: string,
  ): Promise<CartDocument> {
    const user = await this.userService.findOneByEmail(email);

    const cart = await this.cartModule.findOne({
      _id: cartId,
      user: user._id,
    });

    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }

    if (cart.isCompleted) {
      throw new HttpException(
        'Cannot modify completed cart',
        HttpStatus.BAD_REQUEST,
      );
    }

    cart.items = cart.items.filter((item) => item._id?.toString() !== idItem);

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (cart.items.length === 0) {
      return await this.remove(cartId);
    }

    return await cart.save();
  }
}
