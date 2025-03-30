import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from '../type';
import { ApiTags } from '@nestjs/swagger';
import { CompleteDto } from './dto/complete.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCartDto: CreateCartDto, @Req() req: RequestWithUser) {
    return this.cartService.create(createCartDto, req.user.email);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('active')
  @UseGuards(AuthGuard)
  findActiveCart(@Req() req: RequestWithUser) {
    return this.cartService.findActiveCartByUser(req.user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.cartService.remove(id);
  }

  @Post('complete')
  completeCart(@Body() completeDto: CompleteDto) {
    return this.cartService.completeCart(completeDto.cartId);
  }

  @Delete(':cartId/items/:productId')
  removeItem(
    @Param('cartId') cartId: ObjectId,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItemFromCart(cartId, productId);
  }
}
