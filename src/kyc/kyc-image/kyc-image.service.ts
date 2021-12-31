import { Inject, Injectable, Logger } from '@nestjs/common';
import { KYCIMAGE_REPOSITORY } from 'src/core/constants/constants';
import { SharedService } from 'src/shared/shared.service';
import {
  createAndStoreKYCImageData,
  createKYCImageData,
} from './dto/param.interface';
import { KYCImage } from './kyc-image.entity';

@Injectable()
export class KYCImageService {
  private readonly logger = new Logger(KYCImageService.name);

  constructor(
    @Inject(KYCIMAGE_REPOSITORY)
    private readonly KYCImageRepository: typeof KYCImage,
    private readonly sharedService: SharedService,
  ) {}

  async create(createImageData: createKYCImageData | any): Promise<KYCImage> {
    return await this.KYCImageRepository.create<KYCImage>(createImageData);
  }

  async update(
    updateImageData: any,
    id: string,
  ): Promise<[number, KYCImage[]]> {
    return await this.KYCImageRepository.update<KYCImage>(updateImageData, {
      where: {
        id,
      },
    });
  }

  async delete(id: string): Promise<number> {
    return await this.KYCImageRepository.destroy<KYCImage>({
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<KYCImage> {
    return await this.KYCImageRepository.findByPk<KYCImage>(id);
  }

  async findByKycId(
    kycId: string,
  ): Promise<{ count: number; rows: KYCImage[] }> {
    return await this.KYCImageRepository.findAndCountAll({
      where: {
        kycId,
      },
    });
  }

  async createAndStoreImage(
    createAndStoreImageData: createAndStoreKYCImageData | any,
  ): Promise<KYCImage> {
    return new Promise(async (resolve, reject) => {
      let uploadedFile: { filePath: string; error: boolean; fileName: string };
      try {
        uploadedFile = await this.sharedService.uploadKYCImageFile(
          createAndStoreImageData.file,
          `NS-${Date.now()}.jpg`,
        );
      } catch (error) {
        this.logger.error(error);
        return reject(error);
      }

      if (uploadedFile.error) {
        return reject(new Error("Can't upload the file"));
      }

      const createImageData: createKYCImageData | any = {
        name: uploadedFile.fileName,
        url: uploadedFile.filePath,
        kycId: createAndStoreImageData.kycId,
      };
      let createdImage: KYCImage;
      try {
        createdImage = await this.KYCImageRepository.create<KYCImage>(
          createImageData,
        );
      } catch (error) {
        this.logger.error(error);
        return reject(error);
      }
      return resolve(createdImage);
    });
  }
}
