import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import {
  NS_001,
  NS_002,
  NS_003,
  NS_005,
  NS_006,
} from 'src/core/constants/error_codes';
import { SharedService } from 'src/shared/shared.service';
import { User } from 'src/user/user.entity';
import { CreateKycData } from './dto/param.interface';
import {
  AcceptTheKYCApprovalDto,
  CreateKycApprovalDto,
} from './dto/request.dto';
import {
  AcceptTheKYCApprovalResponse,
  CreateKycApprovalResponse,
  FindAllApprovalPendingResponse,
  FindAllApprovalPendingResponseData,
  GetKYCApprovalByMerchantManufacturerIdResponse,
  GetKYCApprovalByMerchantManufacturerIdResponseData,
  GetKycApprovalResponse,
} from './dto/response.dto';
import { createAndStoreKYCImageData } from './kyc-image/dto/param.interface';
import { KYCImage } from './kyc-image/kyc-image.entity';
import { KYCImageService } from './kyc-image/kyc-image.service';
import { KYC } from './kyc.entity';
import { KycService } from './kyc.service';

@Controller('kyc')
@ApiTags('KYC')
export class KycController {
  private readonly logger = new Logger(KycController.name);

  constructor(
    private readonly kycService: KycService,
    private kycImageService: KYCImageService,
    private sharedService: SharedService,
  ) {}

  @Post('createKycApproval')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 5 }]))
  @ApiBody({ type: CreateKycApprovalDto })
  @ApiResponse({ type: CreateKycApprovalResponse })
  @ApiBadRequestResponse({ description: 'User is already verified' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'KYC Data is not processable',
  })
  @ApiCreatedResponse({ description: 'KYC added successfully' })
  async createKycApproval(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: { user: User },
    @Body() body: CreateKycApprovalDto,
    @Res() res: Response,
  ) {
    let response: CreateKycApprovalResponse;

    if (req.user.merchant_or_manufacturer_verified) {
      response = {
        message: 'User is already verified',
        valid: false,
        error: NS_005,
        dialog: {
          header: 'Bad Request',
          message: 'User is already verified',
        },
      };
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    const imageFiles = files['image'];

    const createKycApprovalData: CreateKycData = {
      ...body,
      userId: req.user.id,
    };

    let createdKycApproval: KYC;
    try {
      createdKycApproval = await this.kycService.create(createKycApprovalData);
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

    if (!createdKycApproval) {
      response = {
        message: 'KYC Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'KYC input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    for (let i = 0; i < imageFiles.length; i++) {
      const currentFile = imageFiles[i];

      const createAndStoreKycImageData: createAndStoreKYCImageData = {
        file: currentFile.buffer,
        kycId: createdKycApproval.id,
      };

      let createdKycImage: KYCImage;
      try {
        createdKycImage = await this.kycImageService.createAndStoreImage(
          createAndStoreKycImageData,
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
      if (!createdKycImage) {
        response = {
          message: 'KYC Image Data is not processable',
          valid: false,
          error: NS_001,
          dialog: {
            header: 'Wrong input',
            message: 'KYC Image input is not processable',
          },
        };
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
      }
    }

    response = {
      message: 'KYC added successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Get('findAllApprovalPending')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: FindAllApprovalPendingResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiOkResponse({ description: 'Pending KYC Approvals fetched successfully' })
  async findAllApprovalPending(@Res() res: Response) {
    let response: FindAllApprovalPendingResponse;

    let pendingKycApprovals: FindAllApprovalPendingResponseData;
    try {
      pendingKycApprovals = await this.kycService.findAllApprovalPending();
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
      message: 'Pending KYC Approvals fetched successfully',
      valid: true,
      data: pendingKycApprovals,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Patch('acceptTheKycApproval')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: AcceptTheKYCApprovalDto })
  @ApiResponse({ type: AcceptTheKYCApprovalResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  async acceptTheKycApproval(
    @Req() req: { user: User },
    @Body() body: AcceptTheKYCApprovalDto,
    @Res() res: Response,
  ) {
    let response: AcceptTheKYCApprovalResponse;

    if (req.user.role !== 'Admin') {
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

    let fetchedKYCApproval: KYC;
    try {
      fetchedKYCApproval = await this.kycService.findByPk(body.kycId);
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

    if (!fetchedKYCApproval) {
      response = {
        message: 'KYC Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'KYC input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    if (body.approval) {
      let acceptedKycApproval;
      try {
        acceptedKycApproval = await this.kycService.acceptTheKYCApproval(
          body.kycId,
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

      if (!acceptedKycApproval) {
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
        message: 'KYC approved successfully',
        valid: true,
      };
      return res.status(HttpStatus.ACCEPTED).json(response);
    } else {
      let declinedKycApproval;
      try {
        declinedKycApproval = await this.kycService.declineTheKYCApproval(
          body.kycId,
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
      if (!declinedKycApproval) {
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

      let emailSent: { mail: any; error: boolean };
      try {
        emailSent = await this.sharedService.sendKYCRejectMail(
          fetchedKYCApproval.user.email,
          body.declineReason,
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

      if (emailSent.error) {
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_006,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      response = {
        message: 'KYC approval declined successfully',
        valid: true,
      };
      return res.status(HttpStatus.OK).json(response);
    }
  }

  @Get('getKycApproval')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'kycId',
    type: String,
    description: 'KYC Id',
    required: true,
  })
  @ApiResponse({ type: GetKycApprovalResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'KYC Data is not processable',
  })
  @ApiFoundResponse({ description: 'KYC Approval fetched successfully' })
  async getKycApproval(@Query('kycId') kycId: string, @Res() res: Response) {
    let response: GetKycApprovalResponse;

    let fetchedKycApproval: KYC;
    try {
      fetchedKycApproval = await this.kycService.findByPk(kycId);
    } catch (error) {
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

    if (!fetchedKycApproval) {
      response = {
        message: 'KYC Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'KYC input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'KYC Approval fetched successfully',
      valid: true,
      data: fetchedKycApproval,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getKYCApprovalByMerchantManufacturerId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'KYC Approvals fetched successfully' })
  async getKYCApprovalByMerchantManufacturerId(
    @Req() req: { user: User },
    @Res() res: Response,
  ): Promise<Response<GetKYCApprovalByMerchantManufacturerIdResponse>> {
    let response: GetKYCApprovalByMerchantManufacturerIdResponse;

    let fetchedKycApprovals: GetKYCApprovalByMerchantManufacturerIdResponseData;
    try {
      fetchedKycApprovals =
        await this.kycService.findAllKycByMerchantManufacturerId(req.user.id);
    } catch (error) {
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
      message: 'KYC Approvals fetched successfully',
      valid: true,
      data: fetchedKycApprovals,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }
}
