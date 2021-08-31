import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { PRODUCT_REPOSITORY } from 'src/core/constants/constants';
import { Price } from 'src/price/price.entity';
import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';
import { Category } from './category/category.entity';
import { createProductData } from './dto/param.interface';
import { Image } from './image/image.entity';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly ProductRepository: typeof Product,
  ) {}

  async create(createProductData: createProductData | any): Promise<Product> {
    return await this.ProductRepository.create<Product>(createProductData);
  }

  async update(
    updateProductData: any,
    id: string,
    userId: string,
  ): Promise<any> {
    return await this.ProductRepository.update<Product>(updateProductData, {
      where: {
        id,
        userId,
      },
    });
  }
  async updateByAdmin(updateProductData: any, id: string): Promise<any> {
    return await this.ProductRepository.update<Product>(updateProductData, {
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<Product> {
    return await this.ProductRepository.findByPk<Product>(id);
  }

  async findProductWithCategory(id: string): Promise<Product> {
    return await this.ProductRepository.findOne<Product>({
      where: { id, productApproved: true },
      include: [{ model: Category }, { model: Image }],
    });
  }

  async findProductWithCategoryPrice(id: string): Promise<Product> {
    return await this.ProductRepository.findOne<Product>({
      where: { id, productApproved: true },
      include: [{ model: Category }, { model: Price }, { model: Image }],
    });
  }

  async findProductWithCategoryPriceReview(id: string): Promise<Product> {
    return await this.ProductRepository.findOne<Product>({
      where: { id, productApproved: true },
      include: [
        { model: Category },
        { model: Price },
        { model: Review },
        { model: Image },
      ],
    });
  }

  async findProductWithCategoryPriceReviewManufacturer(
    id: string,
  ): Promise<Product> {
    return await this.ProductRepository.findOne<Product>({
      where: { id, productApproved: true },
      include: [
        { model: Category },
        { model: Price },
        { model: Review },
        { model: User },
        { model: Image },
      ],
    });
  }

  async findProductRequiredApproval(): Promise<{
    count: number;
    rows: Product[];
  }> {
    return await this.ProductRepository.findAndCountAll<Product>({
      where: {
        productApproved: false,
      },
      include: [{ model: User }, { model: Image }],
    });
  }

  async deleteProduct(id: string): Promise<any> {
    return await this.ProductRepository.destroy<Product>({
      where: {
        id,
      },
      cascade: true,
      truncate: true,
      logging: true,
    });
  }

  async findProductsWithCategoryBySearch(
    search: string,
  ): Promise<{ count: number; rows: Product[] }> {
    return await this.ProductRepository.findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iRegexp]: search,
            },
          },
          {
            description: {
              [Op.iRegexp]: search,
            },
          },
        ],
      },
      include: [{ model: Category }, { model: Image }],
    });
  }

  async findProductsWithCategoryByManufacturerId(
    userId: string,
  ): Promise<{ count: number; rows: Product[] }> {
    return await this.ProductRepository.findAndCountAll({
      where: {
        userId,
      },
      include: [{ model: Category }, { model: Image }],
    });
  }
}
