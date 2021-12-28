import { Inject, Injectable, Logger } from '@nestjs/common';
import { KYC_REPOSITORY } from 'src/core/constants/constants';
import { KYC } from './kyc.entity';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    @Inject(KYC_REPOSITORY) private readonly KYCRepository: typeof KYC,
  ) {}
}
