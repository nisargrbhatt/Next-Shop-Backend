import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PaymentDoneDto {
  @ApiProperty({
    type: String,
    description: 'Razorpay Payment Id',
    required: true,
    name: 'rp_payment_id',
  })
  @IsNotEmpty()
  rp_payment_id: string;

  @ApiProperty({
    type: String,
    description: 'Razorpay Order Id',
    required: true,
    name: 'rp_order_id',
  })
  @IsNotEmpty()
  rp_order_id: string;

  @ApiProperty({
    type: String,
    description: 'Razorpay Payment Signature',
    required: true,
    name: 'rp_signature',
  })
  @IsNotEmpty()
  rp_signature: string;
}
