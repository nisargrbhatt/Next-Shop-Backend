import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { Response } from 'express';
import { User } from 'src/user/user.entity';
import {
  GetAllRazorpayCustomerResponse,
  GetAllRazorpayOrderResponse,
  GetAllRazorpayPaymentResponse,
  GetRazorpayCustomerResponse,
  GetRazorpayOrderResponse,
  GetRazorpayPaymentResponse,
} from './dto/response.dto';
import { NS_002 } from 'src/core/constants/error_codes';
import { AuthGuard } from '@nestjs/passport';
import {
  CapturedPayment,
  CreatedCustomerData,
  CreatedOrderData,
  FetchedAllCustomers,
  FetchedAllOrdersData,
  FetchedAllPayments,
} from './dto/param.interface';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
  private logger = new Logger(TransactionController.name);

  constructor(private transactionService: TransactionService) {}

  @Get('getAllRazorpayCustomer')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get All Razorpay Customer list',
    description: 'Get all customer list with pagination',
  })
  @ApiQuery({
    name: 'currentPage',
    required: true,
    type: String,
    description: 'Current Page',
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    type: String,
    description: 'Page Size',
  })
  @ApiResponse({ type: GetAllRazorpayCustomerResponse })
  async getAllRazorpayCustomer(
    @Req() req: { user: User },
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Res() res: Response,
  ) {
    let response: GetAllRazorpayCustomerResponse;

    let fetchedCustomers: FetchedAllCustomers;
    try {
      fetchedCustomers = await this.transactionService.fetchAllCustomers(
        Number(currentPage),
        Number(pageSize),
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
      message: 'Customers fetched Successfully',
      valid: true,
      data: fetchedCustomers,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAllRazorpayOrder')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get All Razorpay Order list',
    description: 'Get all order list with pagination',
  })
  @ApiQuery({
    name: 'currentPage',
    required: true,
    type: String,
    description: 'Current Page',
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    type: String,
    description: 'Page Size',
  })
  @ApiResponse({ type: GetAllRazorpayOrderResponse })
  async getAllRazorpayOrder(
    @Req() req: { user: User },
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Res() res: Response,
  ) {
    let response: GetAllRazorpayOrderResponse;

    let fetchedOrders: FetchedAllOrdersData;
    try {
      fetchedOrders = await this.transactionService.fetchAllOrders(
        Number(currentPage),
        Number(pageSize),
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
      message: 'Orders fetched Successfully',
      valid: true,
      data: fetchedOrders,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAllRazorpayPayment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get All Razorpay Payment list',
    description: 'Get all payment list with pagination',
  })
  @ApiQuery({
    name: 'currentPage',
    required: true,
    type: String,
    description: 'Current Page',
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    type: String,
    description: 'Page Size',
  })
  @ApiResponse({ type: GetAllRazorpayPaymentResponse })
  async getAllRazorpayPayment(
    @Req() req: { user: User },
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Res() res: Response,
  ) {
    let response: GetAllRazorpayPaymentResponse;

    let fetchedPayments: FetchedAllPayments;
    try {
      fetchedPayments = await this.transactionService.fetchAllPayments(
        Number(currentPage),
        Number(pageSize),
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
      message: 'Orders fetched Successfully',
      valid: true,
      data: fetchedPayments,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getRazorpayOrder')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiQuery({
    type: String,
    required: true,
    name: 'orderId',
    description: 'Order Id',
  })
  @ApiOperation({
    summary: 'Get Razorpay Order',
    description: 'Get Razorpaypay order with orderId',
  })
  @ApiResponse({ type: GetRazorpayOrderResponse })
  async getRazorpayOrder(
    @Req() req: { user: User },
    @Query('orderId') orderId: string,
    @Res() res: Response,
  ) {
    let response: GetRazorpayOrderResponse;

    let fetchedOrder: CreatedOrderData;
    try {
      fetchedOrder = await this.transactionService.fetchOrder(orderId);
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
      message: 'Order fetched Successfully',
      valid: true,
      data: fetchedOrder,
    };
    return res.status(HttpStatus.OK).json(response);
  }
  @Get('getRazorpayPayment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiQuery({
    type: String,
    required: true,
    name: 'paymentId',
    description: 'Payment Id',
  })
  @ApiOperation({
    summary: 'Get Razorpay Payment',
    description: 'Get Razorpaypay Payment with paymentId',
  })
  @ApiResponse({ type: GetRazorpayPaymentResponse })
  async getRazorpayPayment(
    @Req() req: { user: User },
    @Query('paymentId') paymentId: string,
    @Res() res: Response,
  ) {
    let response: GetRazorpayPaymentResponse;

    let fetchedPayment: CapturedPayment;
    try {
      fetchedPayment = await this.transactionService.fetchPayment(paymentId);
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
      message: 'Payment fetched Successfully',
      valid: true,
      data: fetchedPayment,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getRazorpayCustomer')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiQuery({
    type: String,
    required: true,
    name: 'customerId',
    description: 'Customer Id',
  })
  @ApiOperation({
    summary: 'Get Razorpay Customer',
    description: 'Get Razorpaypay Customer with customerId',
  })
  @ApiResponse({ type: GetRazorpayCustomerResponse })
  async getRazorpayCustomer(
    @Req() req: { user: User },
    @Query('customerId') customerId: string,
    @Res() res: Response,
  ) {
    let response: GetRazorpayCustomerResponse;

    let fetchedCustomer: CreatedCustomerData;
    try {
      fetchedCustomer = await this.transactionService.fetchOrder(customerId);
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
      message: 'Order fetched Successfully',
      valid: true,
      data: fetchedCustomer,
    };
    return res.status(HttpStatus.OK).json(response);
  }
}
