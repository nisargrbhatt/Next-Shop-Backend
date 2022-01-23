import { ApiResponseProperty } from '@nestjs/swagger';

export interface errorData {
  code: string;
  message: string;
}

export interface dialogData {
  header: string;
  message: string;
}

export class PaymentDoneResponse {
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
