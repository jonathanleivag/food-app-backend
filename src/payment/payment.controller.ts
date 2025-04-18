import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Header,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { handleSuccessQuery, RequestWithUser } from 'src/type';
import { AuthGuard } from 'src/auth/auth.guard';
import { ObjectId } from 'mongoose';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  create(
    @Body('createPaymentDto') createPaymentDto: CreatePaymentDto,
    @Body('cardId') cardId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.paymentService.create(createPaymentDto, req.user.sub, cardId);
  }

  @Get('success/:idCard')
  @Header('Content-Type', 'text/html')
  async getPaymentStatus(
    @Query() query: handleSuccessQuery,
    @Param('idCard') idCard: ObjectId,
  ) {
    return this.paymentService.paymentSuccess(
      {
        paymentId: query.payment_id,
        preference_id: query.preference_id,
      },
      idCard,
    );
  }

  @Get('failure/:idCard')
  @Header('Content-Type', 'text/html')
  handleFailure(
    @Query() query: handleSuccessQuery,
    @Param('idCard') idCard: ObjectId,
  ) {
    return this.paymentService.paymentSuccess(
      {
        paymentId: query.payment_id,
        preference_id: query.preference_id,
      },
      idCard,
    );
  }

  @Get('pending')
  handlePending(@Query() query: handleSuccessQuery) {
    return this.paymentService.paymentPending({
      paymentId: query.payment_id,
      preference_id: query.preference_id,
    });
  }
}
