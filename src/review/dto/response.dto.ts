import { ApiResponseProperty } from '@nestjs/swagger';
import { Review } from '../review.entity';

export interface errorData {
  code: string;
  message: string;
}

export interface dialogData {
  header: string;
  message: string;
}

export interface GetReviewsByProductIdData {
  count: number;
  rows: Review[];
}

export class AddReviewResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;
}

export class UpdateReviewResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;
}

export class GetReviewResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;

  @ApiResponseProperty({
    type: Object,
  })
  data?: Review;
}

export class GetReviewsByProductIdResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;

  @ApiResponseProperty({
    type: Object,
  })
  data?: GetReviewsByProductIdData;
}
