import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { NS_001, NS_002, NS_003 } from 'src/core/constants/error_codes';
import { User } from '../user.entity';
import { Address } from './address.entity';
import { AddressService } from './address.service';
import { createAddressData } from './dto/param.interface';
import { CreateAddressDto, UpdateAddressDto } from './dto/request.dto';
import {
  CreateAddressResponse,
  DeleteAddressResponse,
  GetAddressesData,
  GetAddressesResponse,
  GetAddressResponse,
  UpdateAddressResponse,
} from './dto/response.dto';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  private readonly logger = new Logger(AddressController.name);
  constructor(private readonly addressService: AddressService) {}

  @Post('createAddress')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateAddressDto })
  @ApiUnprocessableEntityResponse({
    description: 'Address Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Address added Successfully' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiResponse({ type: CreateAddressResponse })
  async createAddress(
    @Req() req: { user: User },
    @Body() body: CreateAddressDto,
    @Res() res: Response,
  ) {
    let response: CreateAddressResponse;
    const createAddressData: createAddressData = {
      ...body,
      userId: req.user.id,
    };
    let addressCreated;
    try {
      addressCreated = await this.addressService.create(createAddressData);
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

    if (!addressCreated) {
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

    response = {
      message: 'Address added Successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Put('updateAddress')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ type: UpdateAddressResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Address updated successfully' })
  async updateAddress(
    @Req() req: { user: User },
    @Body() body: UpdateAddressDto,
    @Res() res: Response,
  ) {
    let response: UpdateAddressResponse;
    const updateAddressData = { ...body, address_id: undefined };

    let updatedAddress;
    try {
      updatedAddress = await this.addressService.update(
        updateAddressData,
        body.address_id,
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
    if (!updatedAddress) {
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
      message: 'Address updated successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAddresses')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({
    type: GetAddressesResponse,
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiOkResponse({ description: 'Addresses fetched succcessfully' })
  async getAddresses(@Req() req: { user: User }, @Res() res: Response) {
    let response: GetAddressesResponse;

    let addressData: GetAddressesData;
    try {
      addressData = await this.addressService.findByUserId(req.user.id);
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
      message: 'Addresses fetched succcessfully',
      valid: true,
      data: addressData,
    };

    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAddress')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetAddressResponse })
  @ApiQuery({
    name: 'addressId',
    type: String,
    description: 'Address Id',
    required: true,
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiOkResponse({ description: 'Address fetched succcessfully' })
  async getAddress(
    @Req() req: { user: User },
    @Query('addressId') addressId: string,
    @Res() res: Response,
  ) {
    let response: GetAddressResponse;

    let addressData: Address;
    try {
      addressData = await this.addressService.findByPk(addressId);
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
      message: 'Address fetched succcessfully',
      valid: true,
      data: addressData,
    };

    return res.status(HttpStatus.OK).json(response);
  }

  @Delete('deleteAddress')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: DeleteAddressResponse })
  @ApiQuery({
    name: 'addressId',
    type: String,
    description: 'Address Id',
    required: true,
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Address removed successfully' })
  async deleteAddress(
    @Req() req: { user: User },
    @Query('addressId') addressId: string,
    @Res() res: Response,
  ) {
    let response: DeleteAddressResponse;

    let deletedAddress;
    try {
      deletedAddress = await this.addressService.deleteAddress(
        addressId,
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

    if (!deletedAddress) {
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
      message: 'Address removed successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }
}
