import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Response, Express } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NS_001, NS_002 } from 'src/core/constants/error_codes';
import { User } from 'src/user/user.entity';
import { createProductData } from './dto/param.interface';
import { CreateProductDto } from './dto/request.dto';
import { CreateProductResponse } from './dto/response.dto';
import { createAndStoreImageData } from './image/dto/param.interface';
import { Image } from './image/image.entity';
import { ImageService } from './image/image.service';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly imageService: ImageService,
  ) {}

  @Post('createProduct')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 5 }]))
  @ApiResponse({ type: CreateProductResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Product added successfully' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async createProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: { user: User },
    @Body() body: CreateProductDto,
    @Res() res: Response,
  ) {
    let response: CreateProductResponse;

    let imageFiles = files['image'];

    /// To Future Me:
    /// Images is going with it so could create error
    let createProductData: createProductData = {
      ...body,
      userId: req.user.id,
    };

    let createdProduct: Product;
    try {
      createdProduct = await this.productService.create(createProductData);
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
    if (!createdProduct) {
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

    for (let i = 0; i < imageFiles.length; i++) {
      let currentFile = imageFiles[i];

      let createAndStoreImageData: createAndStoreImageData = {
        file: currentFile.buffer,
        productId: createdProduct.id,
      };

      let createdImage: Image;
      try {
        createdImage = await this.imageService.createAndStoreImage(
          createAndStoreImageData,
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
      message: 'Product added successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }
}
