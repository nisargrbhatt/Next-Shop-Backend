import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiAcceptedResponse,
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NS_001, NS_002, NS_003, NS_006 } from 'src/core/constants/error_codes';
import { SharedService } from 'src/shared/shared.service';
import { User } from 'src/user/user.entity';
import { createProductData } from './dto/param.interface';
import {
  ApproveProductDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/request.dto';
import {
  ApproveProductResponse,
  CreateProductResponse,
  GetApprovalRequiredProductData,
  GetApprovalRequiredProductResponse,
  GetProductResponse,
  UpdateProductResponse,
} from './dto/response.dto';
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
    private readonly sharedService: SharedService,
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

  @Put('updateProduct')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ type: UpdateProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Product updated successfully' })
  async updateProduct(
    @Req() req: { user: User },
    @Body() body: UpdateProductDto,
    @Res() res: Response,
  ) {
    let response: UpdateProductResponse;

    let updateProductData = {
      ...body,
      productId: undefined,
    };

    let updatedProduct;
    try {
      updatedProduct = await this.productService.update(
        updateProductData,
        body.productId,
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

    if (!updatedProduct) {
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
      message: 'Product updated successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Patch('approveProduct')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ApproveProductDto })
  @ApiResponse({ type: ApproveProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Product declined successfully' })
  @ApiAcceptedResponse({ description: 'Product approved successfully' })
  async approveProduct(
    @Req() req: { user: User },
    @Body() body: ApproveProductDto,
    @Res() res: Response,
  ) {
    let response: ApproveProductResponse;

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

    if (body.approval) {
      let updateProductData = {
        productApproved: true,
      };
      let updatedProduct;
      try {
        updatedProduct = await this.productService.updateByAdmin(
          updateProductData,
          body.productId,
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
      if (!updatedProduct) {
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
        message: 'Product approved successfully',
        valid: true,
      };
      return res.status(HttpStatus.ACCEPTED).json(response);
    } else {
      let emailSent: { mail: any; error: boolean };
      try {
        emailSent = await this.sharedService.sendProductRejectMail(
          req.user.email,
          body.declineReason,
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

      let deletedProduct;
      try {
        deletedProduct = await this.productService.deleteProduct(
          body.productId,
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

      if (!deletedProduct) {
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
        message: 'Product declined successfully',
        valid: true,
      };
      return res.status(HttpStatus.OK).json(response);
    }
  }

  @Get('getApprovalRequiredProduct')
  @ApiResponse({ type: GetApprovalRequiredProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Products fetched successfully' })
  async getApprovalRequiredProduct(@Res() res: Response) {
    let response: GetApprovalRequiredProductResponse;

    let fetchedProduct: GetApprovalRequiredProductData;
    try {
      fetchedProduct = await this.productService.findProductRequiredApproval();
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
      message: 'Products fetched successfully',
      valid: true,
      data: fetchedProduct,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getProduct')
  @ApiQuery({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProduct(
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct = await this.productService.findByPk(productId);
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

    response = {
      message: 'Product fetched successfully',
      valid: true,
      data: fetchedProduct,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getProductWithCategory')
  @ApiQuery({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategory(
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct = await this.productService.findProductWithCategory(
        productId,
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

    response = {
      message: 'Product fetched successfully',
      valid: true,
      data: fetchedProduct,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getProductWithCategoryPrice')
  @ApiQuery({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategoryPrice(
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct = await this.productService.findProductWithCategoryPrice(
        productId,
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

    response = {
      message: 'Product fetched successfully',
      valid: true,
      data: fetchedProduct,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getProductWithCategoryPriceReview')
  @ApiQuery({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategoryPriceReview(
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct =
        await this.productService.findProductWithCategoryPriceReview(productId);
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

    response = {
      message: 'Product fetched successfully',
      valid: true,
      data: fetchedProduct,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getProductWithCategoryPriceReviewManufacturer')
  @ApiQuery({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategoryPriceReviewManufacturer(
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct =
        await this.productService.findProductWithCategoryPriceReviewManufacturer(
          productId,
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

    response = {
      message: 'Product fetched successfully',
      valid: true,
      data: fetchedProduct,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }
}
