import { Inject, Injectable } from '@nestjs/common';
import { PRICE_REPOSITORY } from 'src/core/constants/constants';
import { createPriceData } from './dto/param.interface';
import { Price } from './price.entity';

@Injectable()
export class PriceService {
  constructor(
    @Inject(PRICE_REPOSITORY) private readonly PriceRepository: typeof Price,
  ) {}

  async create(createPriceData: createPriceData | any): Promise<Price> {
    return await this.PriceRepository.create<Price>(createPriceData);
  }

  async update(
    updatePriceData: any,
    id: string,
    merchantId: string,
  ): Promise<any> {
    return await this.PriceRepository.update<Price>(updatePriceData, {
      where: {
        id,
        merchantId,
      },
    });
  }

  async delete(id: string, merchantId: string): Promise<any> {
    return await this.PriceRepository.destroy({
      where: {
        id,
        merchantId,
      },
    });
  }

  async findByPk(id: string): Promise<Price> {
    return await this.PriceRepository.findByPk<Price>(id);
  }

  async findByProductId(
    productId: string,
  ): Promise<{ count: number; rows: Price[] }> {
    return await this.PriceRepository.findAndCountAll<Price>({
      where: { productId },
    });
  }

  async findByMerchantId(
    merchantId: string,
  ): Promise<{ count: number; rows: Price[] }> {
    return await this.PriceRepository.findAndCountAll<Price>({
      where: {
        merchantId,
      },
    });
  }
}
