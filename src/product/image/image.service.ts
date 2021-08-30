import { Inject, Injectable } from '@nestjs/common';
import { IMAGE_REPOSITORY } from 'src/core/constants/constants';
import { SharedService } from 'src/shared/shared.service';
import {
  createAndStoreImageData,
  createImageData,
} from './dto/param.interface';
import { Image } from './image.entity';

@Injectable()
export class ImageService {
  constructor(
    @Inject(IMAGE_REPOSITORY) private readonly ImageRepository: typeof Image,
    private readonly sharedService: SharedService,
  ) {}

  async create(createImageData: createImageData | any): Promise<Image> {
    return await this.ImageRepository.create<Image>(createImageData);
  }

  async update(updateImageData: any, id: string): Promise<any> {
    return await this.ImageRepository.update<Image>(updateImageData, {
      where: {
        id,
      },
    });
  }

  async delete(id: string): Promise<any> {
    return await this.ImageRepository.destroy<Image>({
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<Image> {
    return await this.ImageRepository.findByPk<Image>(id);
  }

  async findByProductId(
    productId: string,
  ): Promise<{ count: number; rows: Image[] }> {
    return await this.ImageRepository.findAndCountAll({
      where: {
        productId,
      },
    });
  }

  async createAndStoreImage(
    createAndStoreImageData: createAndStoreImageData | any,
  ): Promise<Image> {
    return new Promise(async (resolve, reject) => {
      let uploadedFile: { filePath: string; error: boolean; fileName: string };
      try {
        uploadedFile = await this.sharedService.uploadImageFile(
          createAndStoreImageData.file,
          `NS-${Date.now()}.jpg`,
        );
      } catch (error) {
        console.error(error);
        return reject(error);
      }

      if (uploadedFile.error) {
        return reject(new Error("Can't upload the file"));
      }

      let createImageData: createImageData | any = {
        name: uploadedFile.fileName,
        url: uploadedFile.filePath,
        productId: createAndStoreImageData.productId,
      };
      let createdImage: Image;
      try {
        createdImage = await this.ImageRepository.create<Image>(
          createImageData,
        );
      } catch (error) {
        console.error(error);
        return reject(error);
      }
      return resolve(createdImage);
    });
  }
}
