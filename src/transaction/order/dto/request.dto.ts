import { ApiProperty } from '@nestjs/swagger';

export class CreateSingleProductOrderDto {
  @ApiProperty({
    type: String,
    description: 'Address Id',
    name: 'addressId',
    required: true,
  })
  addressId: string;

  @ApiProperty({
    type: String,
    description: 'Price Id',
    name: 'priceId',
    required: true,
  })
  priceId: string;

  @ApiProperty({
    type: String,
    description: 'Product Id',
    name: 'productId',
    required: true,
  })
  productId: string;

  @ApiProperty({
    type: Number,
    description: 'Quantity Of Product',
    name: 'quantity',
    required: true,
    minimum: 1,
    maximum: 5,
  })
  quantity: number;
}

export class OrderDecisionByMerchantDto {
  @ApiProperty({
    type: String,
    description: 'Order Id',
    name: 'orderId',
    required: true,
  })
  orderId: string;

  @ApiProperty({
    type: Boolean,
    description: 'Order decision',
    name: 'decision',
    required: true,
  })
  decision: boolean;
}
