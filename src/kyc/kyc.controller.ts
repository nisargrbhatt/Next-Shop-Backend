import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KycService } from './kyc.service';

@Controller('kyc')
@ApiTags('KYC')
export class KycController {
  private readonly logger = new Logger(KycController.name);

  constructor(private readonly kycService: KycService) {}
}
