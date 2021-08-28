import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
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
import { createPriceData } from './dto/param.interface';
import { AddPriceDto, UpdatePriceDto } from './dto/request.dto';
import {
  AddPriceResponse,
  GetPriceResponse,
  GetPricesByMerchantIdData,
  GetPricesByMerchantIdResponse,
  UpdatePriceResponse,
} from './dto/response.dto';
import { Price } from './price.entity';
import { PriceService } from './price.service';

@Controller('price')
@ApiTags('Price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post('addPrice')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: AddPriceDto })
  @ApiResponse({ type: AddPriceResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Price Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Price added successfully' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async addPrice(
    @Req() req: { user: User },
    @Body() body: AddPriceDto,
    @Res() res: Response,
  ) {
    let response: AddPriceResponse;

    let createPriceData: createPriceData = {
      ...body,
      merchantId: req.user.id,
    };

    let createdPrice: Price;
    try {
      createdPrice = await this.priceService.create(createPriceData);
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

    if (!createdPrice) {
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

    response = {
      message: 'Price added successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Put('updatePrice')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdatePriceDto })
  @ApiResponse({ type: UpdatePriceResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Price updated successfully' })
  async updatePrice(
    @Req() req: { user: User },
    @Body() body: UpdatePriceDto,
    @Res() res: Response,
  ) {
    let response: UpdatePriceResponse;

    let updatePriceData = {
      ...body,
      priceId: undefined,
    };
    let updatedPrice;
    try {
      updatedPrice = await this.priceService.update(
        updatePriceData,
        body.priceId,
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
    if (!updatedPrice) {
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
      message: 'Price updated successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getPrice')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({
    type: String,
    name: 'priceId',
    required: true,
    description: 'Price Id',
  })
  @ApiResponse({ type: GetPriceResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Price Data is not processable',
  })
  @ApiFoundResponse({ description: 'Price fetched successfully' })
  async getPrice(
    @Req() req: { user: User },
    @Query('priceId') priceId: string,
    @Res() res: Response,
  ) {
    let response: GetPriceResponse;

    let fetchedPrice: Price;
    try {
      fetchedPrice = await this.priceService.findByPk(priceId);
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

    response = {
      message: 'Price fetched successfully',
      valid: true,
      data: fetchedPrice,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getPricesByMerchantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({
    type: GetPricesByMerchantIdResponse,
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Prices fetched successfully' })
  async getPricesByMerchantId(
    @Req() req: { user: User },
    @Res() res: Response,
  ) {
    let response: GetPricesByMerchantIdResponse;

    let fetchedPrices: GetPricesByMerchantIdData;
    try {
      fetchedPrices = await this.priceService.findByMerchantId(req.user.id);
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
      message: 'Prices fetched successfully',
      valid: true,
      data: fetchedPrices,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }
}
