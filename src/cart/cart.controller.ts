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

  @Get('active/completed')
  findAllCompleted() {
    return this.cartService.findAllCompleted();
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

  @Post('delivered')
  isDeliveredCart(@Body() completeDto: CompleteDto) {
    return this.cartService.deliveryCart(completeDto.cartId);
  }

  @Delete(':cartId/items/:idItem')
  @UseGuards(AuthGuard)
  removeItem(
    @Param('cartId') cartId: ObjectId,
    @Param('idItem') idItem: string,
    @Req() req: RequestWithUser,
  ) {
    return this.cartService.removeItemFromCart(cartId, idItem, req.user.email);
  }

  @Get('completed/user')
  @UseGuards(AuthGuard)
  getCartCompleted(@Req() req: RequestWithUser) {
    return this.cartService.getCartIsCompleted(req.user.email);
  }

  @Get('completed/all')
  getCartCompletedAll() {
    return this.cartService.getCartIsCompletedAll();
  }

  @Post('withdraw/user')
  @UseGuards(AuthGuard)
  retireCart(@Body() completeDto: CompleteDto, @Req() req: RequestWithUser) {
    return this.cartService.retiredCart(
      completeDto.cartId,
      completeDto.code,
      req.user.email,
    );
  }
}
