import { Inject, Injectable, Logger } from '@nestjs/common';
import { Op } from 'sequelize';
import { KYC_REPOSITORY } from 'src/core/constants/constants';

import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateKycData } from './dto/param.interface';
import { KYCImage } from './kyc-image/kyc-image.entity';
import { KYC } from './kyc.entity';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    @Inject(KYC_REPOSITORY) private readonly KYCRepository: typeof KYC,
    private readonly userService: UserService,
  ) {}

  async create(createKycData: CreateKycData | any): Promise<KYC> {
    return await this.KYCRepository.create<KYC>(createKycData);
  }

  async update(updateKycData: any, id: string): Promise<any> {
    return await this.KYCRepository.update<KYC>(updateKycData, {
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<KYC> {
    return await this.KYCRepository.findByPk<KYC>(id, {
      include: [User, KYCImage],
    });
  }

  async findByUserId(userId: string): Promise<{ count: number; rows: KYC[] }> {
    return await this.KYCRepository.findAndCountAll<KYC>({
      where: {
        userId,
      },
      include: [User, KYCImage],
    });
  }

  async findAllApprovalPending(
    currentPage: number,
    pageSize: number,
    search?: string,
  ): Promise<{ count: number; rows: KYC[] }> {
    if (search && search.length > 0) {
      return await this.KYCRepository.findAndCountAll<KYC>({
        where: {
          kyc_approval: false,
          [Op.or]: [
            {
              name: { [Op.iRegexp]: search },
            },
            {
              aadhaar_number: { [Op.iRegexp]: search },
            },
            {
              contact_no: { [Op.iRegexp]: search },
            },
            {
              email: { [Op.iRegexp]: search },
            },
          ],
        },

        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
    } else {
      return await this.KYCRepository.findAndCountAll<KYC>({
        where: {
          kyc_approval: false,
        },

        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
    }
  }

  async acceptTheKYCApproval(id: string): Promise<void> {
    const kycApproval = await this.findByPk(id);
    await this.KYCRepository.update(
      {
        kyc_approval: true,
        admin_decision: true,
      },
      { where: { id } },
    );
    await this.userService.update(
      { merchant_or_manufacturer_verified: true },
      kycApproval.userId,
    );
    this.logger.log(`${kycApproval.user.name}'s KYC approval Accepted.`);
  }

  async declineTheKYCApproval(id: string): Promise<void> {
    const kycApproval = await this.findByPk(id);
    await this.KYCRepository.update(
      {
        kyc_approval: true,
        admin_decision: false,
      },
      { where: { id } },
    );
    await this.userService.update(
      { merchant_or_manufacturer_verified: false },
      kycApproval.userId,
    );
    this.logger.log(`${kycApproval.user.name}'s KYC approval Rejected.`);
  }

  async findAllKycByMerchantManufacturerId(
    id: string,
  ): Promise<{ count: number; rows: KYC[] }> {
    return await this.KYCRepository.findAndCountAll<KYC>({
      where: {
        userId: id,
      },
      include: [User, KYCImage],
    });
  }
}
