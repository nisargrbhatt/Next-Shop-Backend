import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor() {}
}
