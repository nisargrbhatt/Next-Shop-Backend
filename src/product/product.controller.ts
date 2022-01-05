import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
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
import { AuthGuard } from '@nestjs/passport';
import {
  NS_001,
  NS_002,
  NS_003,
  NS_006,
  NS_010,
} from 'src/core/constants/error_codes';
import { SharedService } from 'src/shared/shared.service';
import { User } from 'src/user/user.entity';
import { createProductData } from './dto/param.interface';
import {
  ApproveProductDto,
  CreateProductDto,
  RenewTheApprovalForProductDto,
  UpdateProductDto,
} from './dto/request.dto';
import {
  ApproveProductResponse,
  CreateProductResponse,
  GetApprovalRequiredProductData,
  GetApprovalRequiredProductResponse,
  GetProductResponse,
  GetProductWithCategoryByManufacturerIdData,
  GetProductWithCategoryByManufacturerIdResponse,
  GetProductWithCategoryBySearchData,
  GetProductWithCategoryBySearchResponse,
  RenewTheApprovalForProductResponse,
  UpdateProductResponse,
} from './dto/response.dto';
import { createAndStoreImageData } from './image/dto/param.interface';
import { Image } from './image/image.entity';
import { ImageService } from './image/image.service';
import { Product } from './product.entity';
import { ProductService } from './product.service';

import * as slugify from 'slugify';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    private readonly productService: ProductService,
    private readonly imageService: ImageService,
    private readonly sharedService: SharedService,
  ) {}

  @Post('createProduct')
  @UseGuards(AuthGuard('jwt'))
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
  @ApiUnauthorizedResponse({ description: 'User is not verified' })
  async createProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: { user: User },
    @Body() body: CreateProductDto,
    @Res() res: Response,
  ) {
    let response: CreateProductResponse;

    if (!req.user.merchant_or_manufacturer_verified) {
      response = {
        message: 'User is not verified',
        valid: false,
        error: NS_010,
        dialog: {
          header: 'Not Authorized',
          message: 'User is not verified',
        },
      };
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    // Product Slig Creation
    let adder = '';
    let productSlug: string;
    while (true) {
      productSlug = slugify.default(body.name + adder);

      const productSlugCount = await this.productService.findOneBySlug(
        productSlug,
      );

      if (productSlugCount < 1) {
        break;
      }
      adder += '1';
    }

    const imageFiles = files['image'];

    /// To Future Me:
    /// Images is going with it so could create error
    const createProductData: createProductData = {
      ...body,
      slug: productSlug,
      userId: req.user.id,
    };

    let createdProduct: Product;
    try {
      createdProduct = await this.productService.create(createProductData);
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
      const currentFile = imageFiles[i];

      const createAndStoreImageData: createAndStoreImageData = {
        file: currentFile.buffer,
        productId: createdProduct.id,
      };

      let createdImage: Image;
      try {
        createdImage = await this.imageService.createAndStoreImage(
          createAndStoreImageData,
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
  @UseGuards(AuthGuard('jwt'))
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

    const updateProductData = {
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ApproveProductDto })
  @ApiResponse({ type: ApproveProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Product declined successfully' })
  @ApiAcceptedResponse({ description: 'Product approved successfully' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
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

    if (body.approval) {
      const updateProductData = {
        productApproved: true,
        approval_status: true,
      };
      let updatedProduct;
      try {
        updatedProduct = await this.productService.updateByAdmin(
          updateProductData,
          body.productId,
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
      if (fetchedProduct.decline_count > 2) {
        let deletedProduct: number;
        try {
          deletedProduct = await this.productService.deleteProduct(
            body.productId,
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
      } else {
        let updatedProduct: [number, Product[]];
        try {
          updatedProduct = await this.productService.productDeclined(
            fetchedProduct.decline_count,
            body.declineReason,
            body.productId,
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
      }

      let emailSent: { mail: any; error: boolean };
      try {
        emailSent = await this.sharedService.sendProductRejectMail(
          fetchedProduct.user.email,
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
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'productSlug',
    description: 'Product Slug',
    required: false,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategory(
    @Query() query: { productId?: string; productSlug?: string },
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct = await this.productService.findProductWithCategory(
        query.productId,
        query.productSlug,
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
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'productSlug',
    description: 'Product Slug',
    required: false,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategoryPrice(
    @Query() query: { productId?: string; productSlug?: string },
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct = await this.productService.findProductWithCategoryPrice(
        query.productId,
        query.productSlug,
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
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'productSlug',
    description: 'Product Slug',
    required: false,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategoryPriceReview(
    @Query() query: { productId?: string; productSlug?: string },
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct =
        await this.productService.findProductWithCategoryPriceReview(
          query.productId,
          query.productSlug,
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
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'productSlug',
    description: 'Product Slug',
    required: false,
  })
  @ApiResponse({ type: GetProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiFoundResponse({ description: 'Product fetched successfully' })
  async getProductWithCategoryPriceReviewManufacturer(
    @Query() query: { productId?: string; productSlug?: string },
    @Res() res: Response,
  ) {
    let response: GetProductResponse;

    let fetchedProduct: Product;
    try {
      fetchedProduct =
        await this.productService.findProductWithCategoryPriceReviewManufacturer(
          query.productId,
          query.productSlug,
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

  @Get('getProductWithCategoryBySearch')
  @ApiQuery({
    type: String,
    name: 'search',
    description: 'Search of the product',
    required: true,
  })
  @ApiResponse({ type: GetProductWithCategoryBySearchResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Products fetched successfully' })
  async getProductWithCategoryBySearch(
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    let response: GetProductWithCategoryBySearchResponse;

    let fetchedProducts: GetProductWithCategoryBySearchData;
    try {
      fetchedProducts =
        await this.productService.findProductsWithCategoryBySearch(search);
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
      message: 'Products fetched successfully',
      valid: true,
      data: fetchedProducts,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getProductWithCategoryByManufacturerId')
  @ApiQuery({
    type: String,
    name: 'manufacturerId',
    description: 'Manufacturter Id',
    required: true,
  })
  @ApiResponse({
    type: GetProductWithCategoryByManufacturerIdResponse,
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Products fetched successfully' })
  async getProductWithCategoryByManufacturerId(
    @Query('manufacturerId') manufacturerId: string,
    @Res() res: Response,
  ) {
    let response: GetProductWithCategoryByManufacturerIdResponse;

    let fetchedProducts: GetProductWithCategoryByManufacturerIdData;
    try {
      fetchedProducts =
        await this.productService.findProductsWithCategoryByManufacturerId(
          manufacturerId,
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
      message: 'Products fetched successfully',
      valid: true,
      data: fetchedProducts,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getProductWithCategoryByManufacturerIdApprovalPending')
  @ApiQuery({
    type: String,
    name: 'manufacturerId',
    description: 'Manufacturter Id',
    required: true,
  })
  @ApiResponse({
    type: GetProductWithCategoryByManufacturerIdResponse,
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Products fetched successfully' })
  async getProductWithCategoryByManufacturerIdApprovalPending(
    @Query('manufacturerId') manufacturerId: string,
    @Res() res: Response,
  ) {
    let response: GetProductWithCategoryByManufacturerIdResponse;

    let fetchedProducts: GetProductWithCategoryByManufacturerIdData;
    try {
      fetchedProducts =
        await this.productService.findProductsWithCategoryByManufacturerIdApprovalPending(
          manufacturerId,
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
      message: 'Products fetched successfully',
      valid: true,
      data: fetchedProducts,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Patch('renewTheApprovalForProduct')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: RenewTheApprovalForProductDto })
  @ApiResponse({ type: RenewTheApprovalForProductResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Product Data is not processable',
  })
  @ApiOkResponse({ description: 'Product approval renewed' })
  async renewTheApprovalForProduct(
    @Req() req: { user: User },
    @Body() body: RenewTheApprovalForProductDto,
    @Res() res: Response,
  ): Promise<Response<RenewTheApprovalForProductResponse>> {
    let response: RenewTheApprovalForProductResponse;

    let approvalUpdated: [number, Product[]];
    try {
      approvalUpdated = await this.productService.approvalRenew(
        body.productId,
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

    if (!approvalUpdated) {
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
      message: 'Product approval renewed',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }
}
