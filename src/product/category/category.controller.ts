import {
  Body,
  Controller,
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

import { NS_001, NS_002, NS_003 } from 'src/core/constants/error_codes';
import { User } from 'src/user/user.entity';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { createCategoryData } from './dto/param.interface';
import { AddCategoryDto, UpdateCategoryDto } from './dto/request.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  AddCategoryResponse,
  GetAllCategoriesData,
  GetAllCategoriesResponse,
  GetCategoryByIdResponse,
  GetCategoryByNameResponse,
  GetCategoryResponse,
  UpdateCategoryResponse,
} from './dto/response.dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: AddCategoryDto })
  @ApiResponse({ type: AddCategoryResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Category Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Category added successfully' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async addCategory(
    @Req() req: { user: User },
    @Body() body: AddCategoryDto,
    @Res() res: Response,
  ) {
    let response: AddCategoryResponse;

    const createCategoryData: createCategoryData = {
      ...body,
    };

    let createdCategory: Category;
    try {
      createdCategory = await this.categoryService.create(createCategoryData);
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

    if (!createdCategory) {
      response = {
        message: 'Category Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Category input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'Category added successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Put('updateCategory')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ type: UpdateCategoryResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Category updated successfully' })
  async updateCategory(
    @Req() req: { user: User },
    @Body() body: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    let response: UpdateCategoryResponse;

    const updateCategoryData = {
      ...body,
      categoryId: undefined,
    };
    let updatedCategory;
    try {
      updatedCategory = await this.categoryService.update(
        updateCategoryData,
        body.categoryId,
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

    if (!updatedCategory) {
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
      message: 'Category updated successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getAllCategories')
  @ApiResponse({ type: GetAllCategoriesResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiOkResponse({ description: 'Categories fetched successfully' })
  async getAllCategories(@Res() res: Response) {
    let response: GetAllCategoriesResponse;

    let fetchedCategories: GetAllCategoriesData;
    try {
      fetchedCategories = await this.categoryService.findAllCategory();
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
      message: 'Categories fetched successfully',
      valid: true,
      data: fetchedCategories,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getCategory')
  @ApiQuery({
    type: String,
    name: 'categoryId',
    description: 'Category Id',
    required: true,
  })
  @ApiResponse({ type: GetCategoryResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Category Data is not processable',
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiOkResponse({ description: 'Category fetched successfully' })
  async getCategory(
    @Query('categoryId') categoryId: string,
    @Res() res: Response,
  ) {
    let response: GetCategoryResponse;

    let fetchedCategory: Category;
    try {
      fetchedCategory = await this.categoryService.findByPk(categoryId);
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

    if (!fetchedCategory) {
      response = {
        message: 'Category Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Category input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'Category fetched successfully',
      valid: true,
      data: fetchedCategory,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getCategoryByName')
  @ApiQuery({
    type: String,
    name: 'categoryName',
    required: true,
    description: 'Category name',
  })
  @ApiResponse({ type: GetCategoryByNameResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Category Data is not processable',
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiOkResponse({ description: 'Category fetched successfully' })
  async getCategoryByName(
    @Query('categoryName') categoryName: string,
    @Res() res: Response,
  ) {
    let response: GetCategoryByNameResponse;

    let fetchedCategory: Category;
    try {
      fetchedCategory = await this.categoryService.findByName(categoryName);
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

    if (!fetchedCategory) {
      response = {
        message: 'Category Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Category input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'Category fetched successfully',
      valid: true,
      data: fetchedCategory,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getCategoryById')
  @ApiQuery({
    type: String,
    name: 'categoryId',
    description: 'Category Id',
    required: true,
  })
  @ApiResponse({ type: GetCategoryByIdResponse })
  @ApiUnprocessableEntityResponse({
    description: 'Category Data is not processable',
  })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiOkResponse({ description: 'Category fetched successfully' })
  async getCategoryById(
    @Query('categoryId') categoryId: string,
    @Res() res: Response,
  ) {
    let response: GetCategoryByIdResponse;

    let fetchedCategory: Category;
    try {
      fetchedCategory = await this.categoryService.findById(categoryId);
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

    if (!fetchedCategory) {
      response = {
        message: 'Category Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Category input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'Category fetched successfully',
      valid: true,
      data: fetchedCategory,
    };
    return res.status(HttpStatus.OK).json(response);
  }
}
