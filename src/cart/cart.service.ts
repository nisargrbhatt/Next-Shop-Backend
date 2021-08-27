import { Inject, Injectable } from '@nestjs/common';
import { CART_REPOSITORY } from 'src/core/constants/constants';
import { Price } from 'src/price/price.entity';
import { Product } from 'src/product/product.entity';
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

  async update(updateCartData: any, id: string, userId: string): Promise<any> {
    return await this.CartRepository.update(updateCartData, {
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
      include: [{ model: Price }, { model: Product }],
    });
  }

  async updateQuantity(
    quantity: number,
    id: string,
    userId: string,
  ): Promise<any> {
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

  async deleteCartItem(id: string, userId: string): Promise<any> {
    return await this.CartRepository.destroy<Cart>({
      where: {
        id,
        userId,
      },
    });
  }
}
