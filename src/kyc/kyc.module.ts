import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ImageService } from 'src/product/image/image.service';
import { SharedService } from 'src/shared/shared.service';
import { KycProviders } from './kyc.provider';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { UserService } from 'src/user/user.service';
import { KYCImageService } from './kyc-image/kyc-image.service';
import { KYCImageController } from './kyc-image/kyc-image.controller';

@Module({
  imports: [AuthModule],
  controllers: [KycController, KYCImageController],
  providers: [
    SharedService,
    ImageService,
    KycService,
    UserService,
    KYCImageService,
    ...KycProviders,
  ],
  exports: [KycService, KYCImageService],
})
export class KycModule {}
