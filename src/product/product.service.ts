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
  ): Promise<[number, Product[]]> {
    return await this.ProductRepository.update<Product>(updateProductData, {
      where: {
        id,
        userId,
      },
    });
  }
  async updateByAdmin(
    updateProductData: any,
    id: string,
  ): Promise<[number, Product[]]> {
    return await this.ProductRepository.update<Product>(updateProductData, {
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<Product> {
    return await this.ProductRepository.findByPk<Product>(id, {
      include: [User, Image, Category],
    });
  }

  async findProductWithCategory(id?: string, slug?: string): Promise<Product> {
    if (id) {
      return await this.ProductRepository.findOne<Product>({
        where: { id, productApproved: true },
        include: [{ model: Category }, { model: Image }],
      });
    } else {
      return await this.ProductRepository.findOne<Product>({
        where: { slug, productApproved: true },
        include: [{ model: Category }, { model: Image }],
      });
    }
  }

  async findProductWithCategoryPrice(
    id?: string,
    slug?: string,
  ): Promise<Product> {
    if (id) {
      return await this.ProductRepository.findOne<Product>({
        where: { id, productApproved: true },
        include: [{ model: Category }, { model: Price }, { model: Image }],
      });
    } else {
      return await this.ProductRepository.findOne<Product>({
        where: { slug, productApproved: true },
        include: [{ model: Category }, { model: Price }, { model: Image }],
      });
    }
  }

  async findProductWithCategoryPriceReview(
    id?: string,
    slug?: string,
  ): Promise<Product> {
    if (id) {
      return await this.ProductRepository.findOne<Product>({
        where: { id, productApproved: true },
        include: [
          { model: Category },
          { model: Price },
          { model: Review },
          { model: Image },
        ],
      });
    } else {
      return await this.ProductRepository.findOne<Product>({
        where: { slug, productApproved: true },
        include: [
          { model: Category },
          { model: Price },
          { model: Review },
          { model: Image },
        ],
      });
    }
  }

  async findProductWithCategoryPriceReviewManufacturer(
    id?: string,
    slug?: string,
  ): Promise<Product> {
    if (id) {
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
    } else {
      return await this.ProductRepository.findOne<Product>({
        where: { slug, productApproved: true },
        include: [
          { model: Category },
          { model: Price },
          { model: Review },
          { model: User },
          { model: Image },
        ],
      });
    }
  }

  async findProductRequiredApproval(
    currentPage: number,
    pageSize: number,
    search?: string,
  ): Promise<{
    count: number;
    rows: Product[];
  }> {
    return await this.ProductRepository.findAndCountAll<Product>({
      where: {
        approval_status: false,
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
      include: [{ model: User }, { model: Image }, { model: Category }],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      col: 'id',
      distinct: true,
    });
  }

  async deleteProduct(id: string): Promise<number> {
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
    return await this.ProductRepository.findAndCountAll<Product>({
      where: {
        productApproved: true,
        [Op.or]: [
          {
            name: { [Op.iRegexp]: search },
          },
          {
            description: { [Op.iRegexp]: search },
          },
          {
            small_description: { [Op.iRegexp]: search },
          },
        ],
      },
      include: [{ model: Category }, { model: Image }],
    });
  }

  async findProductsWithCategoryByManufacturerId(
    userId: string,
    currentPage: number,
    pageSize: number,
    search?: string,
  ): Promise<{ count: number; rows: Product[] }> {
    if (search && search.length > 0) {
      return await this.ProductRepository.findAndCountAll<Product>({
        where: {
          userId,
          productApproved: true,
          [Op.or]: [
            {
              name: { [Op.iRegexp]: search },
            },
            {
              description: { [Op.iRegexp]: search },
            },
            {
              small_description: { [Op.iRegexp]: search },
            },
          ],
        },
        include: [{ model: Category }, { model: Image }],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
    } else {
      return await this.ProductRepository.findAndCountAll<Product>({
        where: {
          userId,
          productApproved: true,
        },
        include: [{ model: Category }, { model: Image }],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
    }
  }

  async findProductsWithCategoryByManufacturerIdApprovalPending(
    userId: string,
    currentPage: number,
    pageSize: number,
    search?: string,
  ): Promise<{ count: number; rows: Product[] }> {
    if (search && search.length > 0) {
      return await this.ProductRepository.findAndCountAll<Product>({
        where: {
          userId,
          productApproved: false,
          [Op.or]: [
            {
              name: { [Op.iRegexp]: search },
            },
            {
              description: { [Op.iRegexp]: search },
            },
            {
              small_description: { [Op.iRegexp]: search },
            },
          ],
        },
        include: [{ model: Category }, { model: Image }],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
    } else {
      return await this.ProductRepository.findAndCountAll<Product>({
        where: {
          userId,
          productApproved: false,
        },
        include: [{ model: Category }, { model: Image }],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
    }
  }

  async findOneBySlug(slug: string): Promise<number> {
    return await this.ProductRepository.count<Product>({
      where: {
        slug,
      },
    });
  }

  async productDeclined(
    currentCount: number,
    reason: string,
    productId: string,
  ): Promise<[number, Product[]]> {
    return await this.ProductRepository.update<Product>(
      {
        decline_count: currentCount + 1,
        decline_reason: reason,
        approval_status: true,
        productApproved: false,
      },
      {
        where: {
          id: productId,
        },
      },
    );
  }

  async approvalRenew(
    id: string,
    userId: string,
  ): Promise<[number, Product[]]> {
    return await this.ProductRepository.update<Product>(
      {
        approval_status: false,
      },
      {
        where: {
          id,
          userId,
        },
      },
    );
  }

  async fetchAllProductByManufacturerId(
    id: string,
    pageSize: number,
    currentPage: number,
  ): Promise<{ rows: Product[]; count: number }> {
    return await this.ProductRepository.findAndCountAll({
      where: {
        userId: id,
      },
      include: [Image, Category],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });
  }
  async fetchAllProductByManufacturerIdSearch(
    id: string,
    pageSize: number,
    currentPage: number,
    search: string,
  ): Promise<{ rows: Product[]; count: number }> {
    return await this.ProductRepository.findAndCountAll({
      where: {
        userId: id,
        [Op.or]: [
          {
            name: { [Op.iRegexp]: search },
          },
          {
            description: { [Op.iRegexp]: search },
          },
          {
            small_description: { [Op.iRegexp]: search },
          },
        ],
      },
      include: [Image, Category],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      col: 'id',
      distinct: true,
    });
  }

  async fetchAllProductWithCategoryImageByCategoryId(
    id: string,
    pageSize: number,
    currentPage: number,
    search: string,
  ): Promise<{ rows: Product[]; count: number }> {
    return await this.ProductRepository.findAndCountAll<Product>({
      where: {
        categoryId: id,
        productApproved: true,
        [Op.or]: [
          {
            name: { [Op.iRegexp]: search },
          },
          {
            description: { [Op.iRegexp]: search },
          },
          {
            small_description: { [Op.iRegexp]: search },
          },
        ],
      },
      include: [Image, Category],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      col: 'id',
      distinct: true,
    });
  }

  async fetchAllProductWithCategoryImageBySearch(
    pageSize: number,
    currentPage: number,
    search: string,
  ): Promise<{ rows: Product[]; count: number }> {
    return await this.ProductRepository.findAndCountAll<Product>({
      where: {
        productApproved: true,
        [Op.or]: [
          {
            name: { [Op.iRegexp]: search },
          },
          {
            description: { [Op.iRegexp]: search },
          },
          {
            small_description: { [Op.iRegexp]: search },
          },
        ],
      },
      include: [Image, Category],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      col: 'id',
      distinct: true,
    });
  }

  async fetchAllProductLookaheadWithCategoryImageBySearch(
    search: string,
  ): Promise<{ rows: Product[]; count: number }> {
    return await this.ProductRepository.findAndCountAll<Product>({
      where: {
        productApproved: true,
        [Op.or]: [
          {
            name: { [Op.iRegexp]: search },
          },
        ],
      },
      include: [
        { model: Image, attributes: ['url'], limit: 1 },
        { model: Category, attributes: ['name'] },
      ],
      attributes: ['name'],
      limit: 5,
      col: 'id',
      distinct: true,
    });
  }
}
