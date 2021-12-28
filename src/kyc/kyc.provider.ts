import {
  IMAGE_REPOSITORY,
  KYCIMAGE_REPOSITORY,
  KYC_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/constants/constants';
import { Image } from 'src/product/image/image.entity';
import { User } from 'src/user/user.entity';
import { KYCImage } from './kyc-image/kyc-image.entity';
import { KYC } from './kyc.entity';

export const KycProviders = [
  {
    provide: IMAGE_REPOSITORY,
    useValue: Image,
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: KYC_REPOSITORY,
    useValue: KYC,
  },
  {
    provide: KYCIMAGE_REPOSITORY,
    useValue: KYCImage,
  },
];
