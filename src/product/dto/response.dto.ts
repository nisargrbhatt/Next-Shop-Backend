import { ApiResponseProperty } from '@nestjs/swagger';
import { Product } from '../product.entity';

export interface errorData {
  code: string;
  message: string;
}

export interface dialogData {
  header: string;
  message: string;
}

export interface GetApprovalRequiredProductData {
  count: number;
  rows: Product[];
}

export interface GetProductWithCategoryBySearchData {
  count: number;
  rows: Product[];
}

export interface GetProductWithCategoryByManufacturerIdData {
  count: number;
  rows: Product[];
}

export class CreateProductResponse {
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

export class UpdateProductResponse {
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

export class ApproveProductResponse {
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

export class GetApprovalRequiredProductResponse {
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
  data?: GetApprovalRequiredProductData;
}

export class GetProductResponse {
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
  data?: Product;
}

export class GetProductWithCategoryBySearchResponse {
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
  data?: GetProductWithCategoryBySearchData;
}

export class GetProductWithCategoryByManufacturerIdResponse {
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
  data?: GetProductWithCategoryByManufacturerIdData;
}
