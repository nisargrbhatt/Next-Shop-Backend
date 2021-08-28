import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AddReviewDto {
  @ApiProperty({
    type: String,
    name: 'message',
    required: false,
    description: 'Review text',
  })
  @IsOptional()
  message: string;

  @ApiProperty({
    type: Number,
    name: 'stars',
    required: true,
    description: 'Stars for the product',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsNotEmpty()
  stars: number;

  @ApiProperty({
    type: String,
    name: 'productId',
    required: true,
    description: 'Product Id',
  })
  @IsUUID(4)
  @IsNotEmpty()
  productId: string;
}

export class UpdateReviewDto {
  @ApiProperty({
    type: String,
    name: 'message',
    required: false,
    description: 'Review text',
  })
  @IsOptional()
  message: string;

  @ApiProperty({
    type: Number,
    name: 'stars',
    required: false,
    description: 'Stars for the product',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsOptional()
  stars: number;

  @ApiProperty({
    type: String,
    name: 'reviewId',
    required: true,
    description: 'Review Id',
  })
  @IsUUID(4)
  @IsNotEmpty()
  reviewId: string;
}
