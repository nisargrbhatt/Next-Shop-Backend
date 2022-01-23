import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { query, Response } from 'express';
import { NS_001, NS_002, NS_005 } from 'src/core/constants/error_codes';
import { User } from 'src/user/user.entity';
import { Order } from '../order/order.entity';
import { OrderService } from '../order/order.service';
import { TransactionService } from '../transaction.service';
import { CreatePaymentData } from './dto/param.interface';
import { PaymentDoneDto } from './dto/request.dto';
import { PaymentDoneResponse } from './dto/response.dto';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private paymentService: PaymentService,
    private transactionService: TransactionService,
    private orderService: OrderService,
    private configService: ConfigService,
  ) {}

  @Post('paymentDone')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: PaymentDoneDto })
  @ApiResponse({ type: PaymentDoneResponse })
  async paymentDone(
    @Req() req: { user: User },
    @Body() body: PaymentDoneDto,
    @Res() res: Response,
  ) {
    let response: PaymentDoneResponse;

    let fetchedOrder: Order;
    try {
      fetchedOrder = await this.orderService.findByRpOrderId(body.rp_order_id);
    } catch (error) {
      this.logger.error(error);
      response = {
        message: 'Something went wrong',
        valid: false,
        error: NS_002,
        dialog: {
          header: 'Server error',
          message: 'There is some error in server. Please try again later',
        },
      };
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    if (!fetchedOrder) {
      response = {
        message: 'Order Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Order input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    const verifySignature: boolean = this.transactionService.checkSignature(
      body.rp_order_id,
      body.rp_payment_id,
      body.rp_signature,
    );
    if (!verifySignature) {
      response = {
        message: 'Bad Request',
        valid: false,
        error: NS_005,
        dialog: {
          header: 'Bad API Body',
          message: 'Bad Request to server',
        },
      };
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    const createPaymentData: CreatePaymentData = {
      orderId: fetchedOrder.id,
      rp_order_id: body.rp_order_id,
      rp_payment_id: body.rp_payment_id,
      rp_signature: body.rp_signature,
    };
    let createdPayment: Payment;
    try {
      createdPayment = await this.paymentService.create(createPaymentData);
    } catch (error) {
      this.logger.error(error);
      response = {
        message: 'Something went wrong',
        valid: false,
        error: NS_002,
        dialog: {
          header: 'Server error',
          message: 'There is some error in server. Please try again later',
        },
      };
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    if (!createdPayment) {
      response = {
        message: 'Payment Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Payment input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    try {
      await this.orderService.update(
        {
          order_status: true,
        },
        fetchedOrder.id,
      );
    } catch (error) {
      this.logger.error(error);
      response = {
        message: 'Something went wrong',
        valid: false,
        error: NS_002,
        dialog: {
          header: 'Server error',
          message: 'There is some error in server. Please try again later',
        },
      };
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    response = {
      message: 'Order placed Successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('razorpay_payment_callback')
  async razorpay_payment_callback(
    @Body()
    body: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    @Res() res: Response,
  ) {
    let fetchedOrder: Order;
    try {
      fetchedOrder = await this.orderService.findByRpOrderId(
        body.razorpay_order_id,
      );
    } catch (error) {
      this.logger.error(error);
    }

    if (fetchedOrder) {
      const verifySignature: boolean = this.transactionService.checkSignature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
      );
      if (verifySignature) {
        const createPaymentData: CreatePaymentData = {
          orderId: fetchedOrder.id,
          rp_order_id: body.razorpay_order_id,
          rp_payment_id: body.razorpay_payment_id,
          rp_signature: body.razorpay_signature,
        };
        let createdPayment: Payment;
        try {
          createdPayment = await this.paymentService.create(createPaymentData);
        } catch (error) {
          this.logger.error(error);
        }

        if (createdPayment) {
          try {
            await this.orderService.update(
              {
                order_status: true,
              },
              fetchedOrder.id,
            );
          } catch (error) {
            this.logger.error(error);
          }
        }
      }
    }
    return res.redirect(this.configService.get('CUSTOMER_ACCESS'));
  }
}
