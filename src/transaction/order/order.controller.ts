import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { NS_001, NS_002, NS_011 } from 'src/core/constants/error_codes';
import { Price } from 'src/price/price.entity';
import { PriceService } from 'src/price/price.service';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { Address } from 'src/user/addresses/address.entity';
import { AddressService } from 'src/user/addresses/address.service';
import { User } from 'src/user/user.entity';
import {
  CreatedNormalRefund,
  CreatedOrderData,
  CreateOrderData,
} from '../dto/param.interface';
import { TransactionService } from '../transaction.service';
import { CreateServerOrderData } from './dto/param.interface';
import {
  CreateSingleProductOrderDto,
  OrderDecisionByMerchantDto,
} from './dto/request.dto';
import {
  CancelOrderResponse,
  CreateSingleProductOrderResponse,
  CreateSingleProductOrderResponseData,
  GetAllMerchantDecisionPendingOrderResponse,
  GetAllOrdersByUserIdResponse,
  GetAllOrdersByUserIdResponseData,
  GetOrderPrefillsResponse,
  OrderDecisionByMerchantResponse,
} from './dto/response.dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private transactionService: TransactionService,
    private priceService: PriceService,
    private productService: ProductService,
    private orderService: OrderService,
    private addressService: AddressService,
  ) {}

  @Post('createSingleProductOrder')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateSingleProductOrderDto })
  @ApiResponse({ type: CreateSingleProductOrderResponse })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong/Payment gateway has some error',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Price Data is not processable/Quantity Data is not processable/Product Data is not processable/Address Data is not processable/Order Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Order Created successfully' })
  async createSingleProductOrder(
    @Req() req: { user: User },
    @Body() body: CreateSingleProductOrderDto,
    @Res() res: Response,
  ) {
    let response: CreateSingleProductOrderResponse;

    //* Step 1: Check all the data exist
    let fetchedPrice: Price;
    try {
      fetchedPrice = await this.priceService.findByPk(body.priceId);
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

    if (!fetchedPrice) {
      response = {
        message: 'Price Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Price input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    //* Step 2: Check if stock is enough
    if (fetchedPrice.stock < body.quantity) {
      response = {
        message: 'Quantity Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Quantity input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    let fetchedProduct: Product;
    try {
      fetchedProduct = await this.productService.findByPk(body.productId);
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

    if (!fetchedProduct) {
      response = {
        message: 'Product Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Product input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    let fetchedAddress: Address;
    try {
      fetchedAddress = await this.addressService.findByPk(body.addressId);
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

    if (!fetchedAddress) {
      response = {
        message: 'Address Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Address input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    //* Step 3: Calculate the total payment price(in Paisa)
    const finalPrice = fetchedPrice.price * body.quantity * 100;

    //* Step 4: Create the razorpay order
    const createRazorpayOrderData: CreateOrderData = {
      amount: finalPrice,
      currency: 'INR',
      receipt: this.transactionService.randomRecieptId(),
      customer_id: req.user.rp_customer_id,
      notes: {
        product_name: fetchedProduct.name,
        quantity: body.quantity,
        userId: req.user.id,
        productId: fetchedProduct.id,
        priceId: fetchedPrice.id,
      },
    };

    let razorpayCreatedOrder: CreatedOrderData;
    try {
      razorpayCreatedOrder = await this.transactionService.createOrder(
        createRazorpayOrderData,
      );
    } catch (error) {
      this.logger.error(error);
      response = {
        message: 'Payment gateway has some error',
        valid: false,
        error: NS_011,
        dialog: {
          header: 'Payment error',
          message: 'Payment gateway has some error',
        },
      };
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }
    if (!razorpayCreatedOrder) {
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

    //* Step 5: Create the database order
    const createOrderData: CreateServerOrderData = {
      userId: req.user.id,
      addressId: body.addressId,
      merchantId: fetchedPrice.merchantId,
      order_status: false,
      priceId: body.priceId,
      productId: body.productId,
      rp_customer_id: req.user.rp_customer_id,
      rp_order_id: razorpayCreatedOrder.id,
      amount: finalPrice,
    };

    let createdServerOrder: Order;
    try {
      createdServerOrder = await this.orderService.create(createOrderData);
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

    if (!createdServerOrder) {
      response = {
        message: 'Order Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Order inputs is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    //* Step 6: Create Response Data (Razorpay Options)
    const responseData: CreateSingleProductOrderResponseData = {
      amount: razorpayCreatedOrder.amount,
      currency: 'INR',
      name: 'Next Shop',
      description: `${fetchedProduct.name}'s Payment`,
      order_id: razorpayCreatedOrder.id,
      customer_id: razorpayCreatedOrder.customer_id,
      prefill: {
        name: req.user.name,
        email: req.user?.email,
        contact: req.user?.contact_no,
      },
      notes: razorpayCreatedOrder.notes,
    };

    //* Step 7: Update the prefill in Server Order
    try {
      await this.orderService.update(
        {
          rp_prefill_data: JSON.stringify(responseData),
        },
        createdServerOrder.id,
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
      message: 'Order Created successfully',
      valid: true,
      data: {
        order_id: createdServerOrder.id,
      },
    };

    //* Step 7: Send the response
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Get('getOrderPrefills')
  @ApiQuery({
    name: 'orderId',
    type: String,
    description: 'Order Id',
    required: true,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetOrderPrefillsResponse })
  async getOrderPrefills(
    @Req() req: { user: User },
    @Query('orderId') orderId: string,
    @Res() res: Response,
  ) {
    let response: GetOrderPrefillsResponse;

    let fetchedOrder: Order;
    try {
      fetchedOrder = await this.orderService.findByPk(orderId);
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

    const responseData: CreateSingleProductOrderResponseData = {
      ...JSON.parse(fetchedOrder.rp_prefill_data),
    };
    response = {
      message: 'Order Prefill fetched successfully',
      valid: true,
      data: responseData,
    };
    return res.status(200).json(response);
  }

  @ApiOperation({
    summary: 'If User wants to cancel the order',
    description: 'It will cancel the order and starts the refund process',
  })
  @Delete('cancelOrder')
  @ApiQuery({
    type: String,
    name: 'orderId',
    description: 'Order Id',
    required: true,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: CancelOrderResponse })
  async cancelOrder(
    @Req() req: { user: User },
    @Query('orderId') orderId: string,
    @Res() res: Response,
  ) {
    let response: CancelOrderResponse;

    let fetchedOrder: Order;
    try {
      fetchedOrder = await this.orderService.findByPk(orderId);
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
          message: 'Order inputs is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    let createdNormalRefund: CreatedNormalRefund;
    try {
      createdNormalRefund = await this.transactionService.createNormalRefund(
        fetchedOrder.payment[0].rp_payment_id,
        fetchedOrder.amount,
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

    if (!createdNormalRefund) {
      this.logger.error('Refund cannot be created');
      response = {
        message: 'Order Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Order inputs is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    try {
      await this.orderService.deleteByUser(
        orderId,
        req.user.id,
        createdNormalRefund.id,
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
      message: 'Order cancelled successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation({ summary: 'Get All Orders By User Id' })
  @Get('getAllOrdersByUserId')
  @ApiQuery({
    name: 'currentPage',
    type: String,
    description: 'Current Page',
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    type: String,
    description: 'Page Size',
    required: true,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAllOrdersByUserIdResponse })
  async getAllOrdersByUserId(
    @Req() req: { user: User },
    @Query() query: { currentPage: string; pageSize: string },
    @Res() res: Response,
  ) {
    let response: GetAllOrdersByUserIdResponse;

    let fetchedOrders: GetAllOrdersByUserIdResponseData;
    try {
      fetchedOrders = await this.orderService.findByUserId(
        req.user.id,
        Number(query.currentPage),
        Number(query.pageSize),
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
      message: 'Orders fetched successfully',
      valid: true,
      data: fetchedOrders,
    };

    return res.status(HttpStatus.OK).json(response);
  }

  @Post('orderDecisionByMerchant')
  @ApiOperation({ summary: "Merchant's decision on order" })
  @ApiBody({ type: OrderDecisionByMerchantDto })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: OrderDecisionByMerchantResponse })
  async orderDecisionByMerchant(
    @Req() req: { user: User },
    @Body() body: OrderDecisionByMerchantDto,
    @Res() res: Response,
  ) {
    let response: OrderDecisionByMerchantResponse;

    let fetchedOrder: Order;
    try {
      fetchedOrder = await this.orderService.findByPk(body.orderId);
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
          message: 'Order inputs is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    if (body.decision) {
      try {
        await this.orderService.update(
          {
            order_decision_status: true,
            order_decision: true,
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
    } else {
      let createdNormalRefund: CreatedNormalRefund;
      try {
        createdNormalRefund = await this.transactionService.createNormalRefund(
          fetchedOrder.payment[0].rp_payment_id,
          fetchedOrder.amount,
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

      if (!createdNormalRefund) {
        this.logger.error('Refund cannot be created');
        response = {
          message: 'Order Data is not processable',
          valid: false,
          error: NS_001,
          dialog: {
            header: 'Wrong input',
            message: 'Order inputs is not processable',
          },
        };
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
      }

      try {
        await this.orderService.update(
          {
            order_decision_status: true,
            order_decision: false,
            refund_status: true,
            order_cancel: true,
            rp_refund_id: createdNormalRefund.id,
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
    }

    response = {
      message: 'Order updated successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAllMerchantDecisionPendingOrder')
  @ApiQuery({
    name: 'currentPage',
    type: String,
    description: 'Current Page',
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    type: String,
    description: 'Page Size',
    required: true,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAllMerchantDecisionPendingOrderResponse })
  async getAllMerchantDecisionPendingOrder(
    @Req() req: { user: User },
    @Query('currentPage') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Res() res: Response,
  ) {
    let response: GetAllMerchantDecisionPendingOrderResponse;

    let fetchedOrders: { count: number; rows: Order[] };
    try {
      fetchedOrders = await this.orderService.findMerchantDecisionPending(
        Number(currentPage),
        Number(pageSize),
        req.user.id,
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
      message: 'Orders fetched successfully',
      valid: true,
      data: fetchedOrders,
    };
    return res.status(HttpStatus.OK).json(response);
  }
}
