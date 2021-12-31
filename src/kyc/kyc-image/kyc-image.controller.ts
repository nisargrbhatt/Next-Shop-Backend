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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
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
import { NS_009, NS_002, NS_001, NS_003 } from 'src/core/constants/error_codes';
import { SharedService } from 'src/shared/shared.service';
import { User } from 'src/user/user.entity';
import { createKYCImageData } from './dto/param.interface';
import { AddKYCImageDto } from './dto/request.dto';
import {
  AddKYCImageResponse,
  DeleteKYCImageResponse,
  GetImageByKycIdResponse,
  GetImageByKycIdData,
} from './dto/response.dto';
import { KYCImage } from './kyc-image.entity';
import { KYCImageService } from './kyc-image.service';
import { Response, Express } from 'express';

@Controller('kyc-image')
@ApiTags('KYCImage')
export class KYCImageController {
  private readonly logger = new Logger(KYCImageController.name);

  constructor(
    private readonly kycImageService: KYCImageService,
    private sharedService: SharedService,
  ) {}

  @Post('addKYCImage')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 5,
      },
    ]),
  )
  @ApiBody({ type: AddKYCImageDto })
  @ApiResponse({ type: AddKYCImageResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Image Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Image added successfully' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async addImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: { user: User },
    @Body() body: AddKYCImageDto,
    @Res() res: Response,
  ): Promise<Response<AddKYCImageResponse>> {
    let response: AddKYCImageResponse;
    const imageFiles = files['image'];
    const uploadedFiles: Array<{
      filePath: string;
      error: boolean;
      fileName: string;
    }> = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const currentFile = imageFiles[i];
      let uploadedFile: { filePath: string; error: boolean; fileName: string };
      try {
        uploadedFile = await this.sharedService.uploadImageFile(
          currentFile.buffer,
          `NS-${Date.now()}.jpg`,
        );
      } catch (error) {
        this.logger.error(error);
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_009,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }

      if (uploadedFile.error) {
        response = {
          message: 'Something went wrong',
          valid: false,
          error: NS_009,
          dialog: {
            header: 'Server error',
            message: 'There is some error in server. Please try again later',
          },
        };
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }
      uploadedFiles.push(uploadedFile);
    }
    for (let j = 0; j < uploadedFiles.length; j++) {
      const currentImageData = uploadedFiles[j];
      const createImageData: createKYCImageData = {
        name: currentImageData.fileName,
        url: currentImageData.filePath,
        kycId: body.kycId,
      };

      let createdImage: KYCImage;
      try {
        createdImage = await this.kycImageService.create(createImageData);
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

      if (!createdImage) {
        response = {
          message: 'Image Data is not processable',
          valid: false,
          error: NS_001,
          dialog: {
            header: 'Wrong input',
            message: 'Image input is not processable',
          },
        };
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
      }
    }

    response = {
      message: 'Image added successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Delete('deleteKYCImage')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiQuery({
    type: String,
    name: 'imageId',
    description: 'Image Id',
    required: true,
  })
  @ApiResponse({ type: DeleteKYCImageResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Image deleted successfully' })
  async deleteImage(
    @Req() req: { user: User },
    @Query('imageId') imageId: string,
    @Res() res: Response,
  ): Promise<Response<DeleteKYCImageResponse>> {
    let response: DeleteKYCImageResponse;

    let deletedImage;
    try {
      deletedImage = await this.kycImageService.delete(imageId);
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

    if (!deletedImage) {
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
      message: 'Image deleted successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getImageByKycId')
  @ApiQuery({
    type: String,
    name: 'kycId',
    description: 'KYC Id',
    required: true,
  })
  @ApiResponse({ type: GetImageByKycIdResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Image fetched successfuly' })
  async getImageByProductId(
    @Query('kycId') kycId: string,
    @Res() res: Response,
  ): Promise<Response<GetImageByKycIdResponse>> {
    let response: GetImageByKycIdResponse;

    let fetchedImages: GetImageByKycIdData;
    try {
      fetchedImages = await this.kycImageService.findByKycId(kycId);
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
      message: 'Image fetched successfuly',
      valid: true,
      data: fetchedImages,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }
}
