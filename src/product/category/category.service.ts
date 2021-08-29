import { Inject, Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { CATEGORY_REPOSITORY } from 'src/core/constants/constants';
import { createCategoryData } from './dto/param.interface';
import { Product } from '../product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly CategoryRepository: typeof Category,
  ) {}

  async create(
    createCategoryData: createCategoryData | any,
  ): Promise<Category> {
    return await this.CategoryRepository.create<Category>(createCategoryData);
  }

  async update(updateCategoryData: any, id: string): Promise<any> {
    return await this.CategoryRepository.update<Category>(updateCategoryData, {
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<Category> {
    return await this.CategoryRepository.findByPk<Category>(id);
  }

  async findAllCategory(): Promise<{ count: number; rows: Category[] }> {
    return await this.CategoryRepository.findAndCountAll<Category>();
  }

  async findByName(name: string): Promise<Category> {
    return await this.CategoryRepository.findOne<Category>({
      where: {
        name,
      },
      include: [{ model: Product }],
    });
  }

  async findById(id: string): Promise<Category> {
    return await this.CategoryRepository.findOne({
      where: {
        id,
      },
      include: [{ model: Product }],
    });
  }
}
