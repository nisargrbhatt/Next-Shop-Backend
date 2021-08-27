import { createAddressData } from './dto/param.interface';
import { Address } from './address.entity';
import { ADDRESS_REPOSITORY } from './../../core/constants/constants';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AddressService {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly AddressRepository: typeof Address,
  ) {}

  async create(createAddressData: createAddressData | any): Promise<Address> {
    return await this.AddressRepository.create<Address>(createAddressData);
  }

  async update(
    updateAddressData: any,
    id: string,
    userId: string,
  ): Promise<any> {
    return await this.AddressRepository.update<Address>(updateAddressData, {
      where: {
        id,
        userId,
      },
    });
  }

  async findByPk(id: string): Promise<Address> {
    return await this.AddressRepository.findByPk<Address>(id);
  }

  async findByUserId(
    userId: string,
  ): Promise<{ count: number; rows: Address[] }> {
    return await this.AddressRepository.findAndCountAll<Address>({
      where: {
        userId,
      },
    });
  }

  async deleteAddress(id: string, userId: string): Promise<any> {
    return await this.AddressRepository.destroy<Address>({
      where: {
        id,
        userId,
      },
    });
  }
}
