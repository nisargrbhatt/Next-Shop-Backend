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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
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
import { Response, Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { NS_001, NS_002, NS_003, NS_009 } from 'src/core/constants/error_codes';
import { SharedService } from 'src/shared/shared.service';
import { User } from 'src/user/user.entity';
import { createImageData } from './dto/param.interface';
import { AddImageDto } from './dto/request.dto';
import {
  AddImageResponse,
  DeleteImageResponse,
  GetImageByProductIdData,
  GetImageByProductIdResponse,
} from './dto/response.dto';
import { Image } from './image.entity';
import { ImageService } from './image.service';

@Controller('image')
@ApiTags('Image')
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(
    private readonly imageService: ImageService,
    private sharedService: SharedService,
  ) {}

  @Post('addImage')
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
  @ApiBody({ type: AddImageDto })
  @ApiResponse({ type: AddImageResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Image Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Image added successfully' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async addImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: { user: User },
    @Body() body: AddImageDto,
    @Res() res: Response,
  ) {
    let response: AddImageResponse;
    let imageFiles = files['image'];
    let uploadedFiles: Array<{
      filePath: string;
      error: boolean;
      fileName: string;
    }> = [];

    for (let i = 0; i < imageFiles.length; i++) {
      let currentFile = imageFiles[i];
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
      let currentImageData = uploadedFiles[j];
      let createImageData: createImageData = {
        name: currentImageData.fileName,
        url: currentImageData.filePath,
        productId: body.productId,
      };

      let createdImage: Image;
      try {
        createdImage = await this.imageService.create(createImageData);
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

  @Delete('deleteImage')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiQuery({
    type: String,
    name: 'imageId',
    description: 'Image Id',
    required: true,
  })
  @ApiResponse({ type: DeleteImageResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Image deleted successfully' })
  async deleteImage(
    @Req() req: { user: User },
    @Query('imageId') imageId: string,
    @Res() res: Response,
  ) {
    let response: DeleteImageResponse;

    let deletedImage;
    try {
      deletedImage = await this.imageService.delete(imageId);
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

  @Get('getImageByProductId')
  @ApiQuery({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @ApiResponse({ type: GetImageByProductIdResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Image fetched successfuly' })
  async getImageByProductId(
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    let response: GetImageByProductIdResponse;

    let fetchedImages: GetImageByProductIdData;
    try {
      fetchedImages = await this.imageService.findByProductId(productId);
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
