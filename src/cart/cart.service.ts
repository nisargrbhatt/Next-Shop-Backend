import { Inject, Injectable } from '@nestjs/common';
import { CART_REPOSITORY } from 'src/core/constants/constants';
import { Price } from 'src/price/price.entity';
import { Category } from 'src/product/category/category.entity';
import { Image } from 'src/product/image/image.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Cart } from './cart.entity';
import { createCartData } from './dto/param.interface';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY) private readonly CartRepository: typeof Cart,
  ) {}

  async create(createCartData: createCartData | any): Promise<Cart> {
    return await this.CartRepository.create<Cart>(createCartData);
  }

  async update(
    updateCartData: any,
    id: string,
    userId: string,
  ): Promise<[number]> {
    return await this.CartRepository.update<Cart>(updateCartData, {
      where: {
        id,
        userId,
      },
    });
  }

  async findByPk(id: string): Promise<Cart> {
    return await this.CartRepository.findByPk<Cart>(id);
  }

  async findByUserId(userId: string): Promise<{ count: number; rows: Cart[] }> {
    return await this.CartRepository.findAndCountAll<Cart>({
      where: {
        userId,
      },
      include: [
        { model: Price, include: [{ model: User }] },
        {
          model: Product,
          include: [{ model: Image, limit: 1 }, { model: Category }],
        },
      ],
    });
  }

  async updateQuantity(
    quantity: number,
    id: string,
    userId: string,
  ): Promise<[number]> {
    return await this.CartRepository.update<Cart>(
      {
        quantity,
      },
      {
        where: {
          id,
          userId,
        },
      },
    );
  }

  async deleteCartItem(id: string, userId: string): Promise<number> {
    return await this.CartRepository.destroy<Cart>({
      where: {
        id,
        userId,
      },
    });
  }
}
