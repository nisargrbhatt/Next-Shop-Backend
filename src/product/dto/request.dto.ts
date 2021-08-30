import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'Name of the product',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'file',
    isArray: true,
    maxItems: 5,
    name: 'photo',
    description: 'Images of the product',
    required: true,
  })
  @IsNotEmpty()
  image: any[];

  @ApiProperty({
    type: String,
    description: 'Description of the product',
    name: 'description',
    required: true,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Specifications of the product',
    name: 'specification',
    required: true,
  })
  @IsNotEmpty()
  specification: string;

  @ApiProperty({
    type: String,
    description: 'Category Id',
    name: 'categoryId',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  categoryId: string;
}

export class UpdateProductDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'Name of the product',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Description of the product',
    name: 'description',
    required: false,
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Specifications of the product',
    name: 'specification',
    required: false,
  })
  @IsOptional()
  specification: string;

  @ApiProperty({
    type: String,
    description: 'Category Id',
    name: 'categoryId',
    required: false,
  })
  @IsOptional()
  @IsUUID(4)
  categoryId: string;

  @ApiProperty({
    type: String,
    description: 'Product Id',
    name: 'productId',
    required: false,
  })
  @IsOptional()
  @IsUUID(4)
  productId: string;
}

export class ApproveProductDto {
  @ApiProperty({
    type: String,
    description: 'Product Id',
    name: 'productId',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  productId: string;

  @ApiProperty({
    type: Boolean,
    description: 'Admin decision about product',
    name: 'approval',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  approval: boolean;

  @ApiProperty({
    type: String,
    description: 'Admin decline reason',
    name: 'declineReason',
    required: false,
  })
  @IsOptional()
  declineReason: string;
}
