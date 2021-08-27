import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    type: Number,
    name: 'quantity',
    description: 'Quantity of item',
    required: true,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    type: String,
    name: 'priceId',
    description: 'Price Id',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  priceId: string;

  @ApiProperty({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  productId: string;
}

export class UpdateQuantityCartDto {
  @ApiProperty({
    type: Number,
    name: 'quantity',
    description: 'Quantity of item',
    required: true,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    type: String,
    name: 'cartId',
    description: 'Cart Id',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  cartId: string;
}
