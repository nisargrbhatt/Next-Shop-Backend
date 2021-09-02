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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NS_001, NS_002, NS_003 } from 'src/core/constants/error_codes';
import { User } from 'src/user/user.entity';
import { createReviewData } from './dto/param.interface';
import { AddReviewDto, UpdateReviewDto } from './dto/request.dto';
import {
  AddReviewResponse,
  GetReviewResponse,
  GetReviewsByProductIdData,
  GetReviewsByProductIdResponse,
  UpdateReviewResponse,
} from './dto/response.dto';
import { Review } from './review.entity';
import { ReviewService } from './review.service';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);
  constructor(private readonly reviewService: ReviewService) {}

  @Post('addReview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: AddReviewDto })
  @ApiResponse({ type: AddReviewResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Review Data is not processable',
  })
  @ApiCreatedResponse({ description: 'Review added successfully' })
  async addReview(
    @Req() req: { user: User },
    @Body() body: AddReviewDto,
    @Res() res: Response,
  ) {
    let response: AddReviewResponse;

    let createReviewData: createReviewData = {
      ...body,
      userId: req.user.id,
    };
    let createdReview: Review;
    try {
      createdReview = await this.reviewService.create(createReviewData);
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

    if (!createdReview) {
      response = {
        message: 'Review Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Review input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'Review added successfully',
      valid: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Put('updateReview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ type: UpdateReviewResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Review updated successfully' })
  async updateReview(
    @Req() req: { user: User },
    @Body() body: UpdateReviewDto,
    @Res() res: Response,
  ) {
    let response: UpdateReviewResponse;

    let updateReviewData = {
      ...body,
      reviewId: undefined,
    };
    let updatedReview;
    try {
      updatedReview = await this.reviewService.update(
        updateReviewData,
        body.reviewId,
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

    if (!updatedReview) {
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
      message: 'Review updated successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getReview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'reviewId',
    type: String,
    description: 'Review Id',
    required: true,
  })
  @ApiResponse({ type: GetReviewResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'Review Data is not processable',
  })
  @ApiFoundResponse({ description: 'Review fetched successfully' })
  async getReview(
    @Req() req: { user: User },
    @Query('reviewId') reviewId: string,
    @Res() res: Response,
  ) {
    let response: GetReviewResponse;

    let fetchedReview: Review;
    try {
      fetchedReview = await this.reviewService.findByPk(reviewId);
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
    if (!fetchedReview) {
      response = {
        message: 'Review Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'Review input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    response = {
      message: 'Review fetched successfully',
      valid: true,
      data: fetchedReview,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }

  @Get('getReviewsByProductId')
  @ApiQuery({
    name: 'productId',
    type: String,
    required: true,
    description: 'Product Id',
  })
  @ApiResponse({ type: GetReviewsByProductIdResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiFoundResponse({ description: 'Reviews fetched successfully' })
  async getReviewsByProductId(
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    let response: GetReviewsByProductIdResponse;

    let fetchedReviews: GetReviewsByProductIdData;
    try {
      fetchedReviews = await this.reviewService.findByProductId(productId);
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
      message: 'Reviews fetched successfully',
      valid: true,
      data: fetchedReviews,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }
}
