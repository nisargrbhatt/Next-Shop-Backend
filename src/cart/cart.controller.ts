import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NS_001, NS_002, NS_003 } from 'src/core/constants/error_codes';
import { User } from 'src/user/user.entity';
import { CartService } from './cart.service';
import { createCartData } from './dto/param.interface';
import { AddToCartDto, UpdateQuantityCartDto } from './dto/request.dto';
import {
  AddToCartResponse,
  DeleteTheItemResponse,
  GetCartData,
  GetCartResponse,
  UpdateQuantityCartResponse,
} from './dto/response.dto';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('addToCart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: AddToCartDto })
  @ApiUnprocessableEntityResponse({
    description: 'Cart Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Item added to cart successfully' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiResponse({ type: AddToCartResponse })
  async addToCart(
    @Req() req: { user: User },
    @Body() body: AddToCartDto,
    @Res() res: Response,
  ) {
    let response: AddToCartResponse;

    const createCartData: createCartData = {
      ...body,
      userId: req.user.id,
    };

    let createdCartItem;
    try {
      createdCartItem = await this.cartService.create(createCartData);
    } catch (error) {
      console.error(error);
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

    if (!createdCartItem) {
      response = {
        message: 'Cart Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Cart input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'Item added to cart successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Patch('updateQuantityCart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateQuantityCartDto })
  @ApiResponse({ type: UpdateQuantityCartResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Cart quantity updated successfully' })
  async updateQuantityCart(
    @Req() req: { user: User },
    @Body() body: UpdateQuantityCartDto,
    @Res() res: Response,
  ) {
    let response: UpdateQuantityCartResponse;

    let updatedCartItem;
    try {
      updatedCartItem = await this.cartService.updateQuantity(
        body.quantity,
        body.cartId,
        req.user.id,
      );
    } catch (error) {
      console.error(error);
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

    if (!updatedCartItem) {
      response = {
        message: 'Not authorized for this operation',
        valid: false,
        error: NS_003,
        dialog: {
          header: 'Not Authorized',
          message: 'You are not authorized for this operation',
        },
      };
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    response = {
      message: 'Cart quantity updated successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Delete('deleteTheItem')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Cart item removed successfully' })
  @ApiResponse({ type: DeleteTheItemResponse })
  @ApiQuery({
    name: 'cartId',
    type: String,
    required: true,
    description: 'Cart Id',
  })
  async deleteTheItem(
    @Req() req: { user: User },
    @Query('cartId') cartId: string,
    @Res() res: Response,
  ) {
    let response: DeleteTheItemResponse;

    let deletedItem;
    try {
      deletedItem = await this.cartService.deleteCartItem(cartId, req.user.id);
    } catch (error) {
      console.error(error);
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
    if (!deletedItem) {
      response = {
        message: 'Not authorized for this operation',
        valid: false,
        error: NS_003,
        dialog: {
          header: 'Not Authorized',
          message: 'You are not authorized for this operation',
        },
      };
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    response = {
      message: 'Cart item removed successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getCart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetCartResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Cart fetched successfully' })
  async getCart(@Req() req: { user: User }, @Res() res: Response) {
    let response: GetCartResponse;

    let cartData: GetCartData;
    try {
      cartData = await this.cartService.findByUserId(req.user.id);
    } catch (error) {
      console.error(error);
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
      message: 'Cart fetched successfully',
      valid: true,
      data: cartData,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }
}
