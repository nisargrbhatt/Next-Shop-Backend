import { ApiResponseProperty } from '@nestjs/swagger';

export interface errorData {
  code: string;
  message: string;
}

export interface dialogData {
  header: string;
  message: string;
}

export interface Notes {
  [key: string]: string | number;
}

export class CreateSingleProductOrderResponseData {
  @ApiResponseProperty({ type: Number })
  amount: number;

  @ApiResponseProperty({ type: String })
  currency: string;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: String })
  description: string;

  @ApiResponseProperty({ type: String })
  order_id: string;

  @ApiResponseProperty({ type: String })
  customer_id: string;

  @ApiResponseProperty({ type: Object })
  prefill: {
    name: string;
    email?: string;
    contact?: string;
  };

  @ApiResponseProperty({ type: Object })
  notes: Notes;
}

export class CreateSingleProductOrderResponse {
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
    type: CreateSingleProductOrderResponseData,
  })
  data?: CreateSingleProductOrderResponseData;
}
