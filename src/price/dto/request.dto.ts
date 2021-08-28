import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AddPriceDto {
  @ApiProperty({
    type: Number,
    name: 'price',
    required: true,
    description: 'Price of the product',
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: Number,
    name: 'stock',
    required: true,
    description: 'Stock of the product',
    minimum: 0,
    maximum: 100,
  })
  @IsNotEmpty()
  @IsInt()
  stock: number;

  @ApiProperty({
    type: String,
    name: 'productId',
    required: true,
    description: 'Product Id',
  })
  @IsNotEmpty()
  @IsUUID(4)
  productId: string;
}

export class UpdatePriceDto {
  @ApiProperty({
    type: Number,
    name: 'price',
    required: false,
    description: 'Price of the product',
  })
  @IsOptional()
  price: number;

  @ApiProperty({
    type: Number,
    name: 'stock',
    required: false,
    description: 'Stock of the product',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  stock: number;

  @ApiProperty({
    type: String,
    name: 'priceId',
    required: true,
    description: 'Price Id',
  })
  @IsNotEmpty()
  @IsUUID(4)
  priceId: string;
}
