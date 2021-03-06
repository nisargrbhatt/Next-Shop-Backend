import { Address } from './../../user/addresses/address.entity';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { databaseConfig } from './database.config';
import { DatabaseConfigAttributes } from './dbconfig.interface';
import { Category } from 'src/product/category/category.entity';
import { Product } from 'src/product/product.entity';
import { Price } from 'src/price/price.entity';
import { Cart } from 'src/cart/cart.entity';
import { Review } from 'src/review/review.entity';
import { Image } from 'src/product/image/image.entity';
import { KYC } from 'src/kyc/kyc.entity';
import { KYCImage } from 'src/kyc/kyc-image/kyc-image.entity';
import { Order } from 'src/transaction/order/order.entity';
import { Payment } from 'src/transaction/payment/payment.entity';

export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (): Promise<Sequelize> => {
      let config: DatabaseConfigAttributes;
      let configProd: SequelizeOptions;

      switch (process.env.NODE_ENV) {
        case process.env.DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case process.env.TEST:
          config = databaseConfig.test;
          break;
        case process.env.PRODUCTION:
          configProd = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      let sequelize: Sequelize;
      if (process.env.NODE_ENV == process.env.PRODUCTION) {
        sequelize = new Sequelize(configProd);
      } else {
        sequelize = new Sequelize(config.urlDatabase, {
          logging: false,
        });
      }

      sequelize.addModels([
        User,
        Address,
        Category,
        Product,
        Price,
        Cart,
        Review,
        Image,
        KYC,
        KYCImage,
        Order,
        Payment,
      ]);

      await sequelize.sync(); //* Production
      // await sequelize.sync({ force: true }); //* Test
      // await sequelize.sync({logging:true,benchmark:true}) //* Development

      return sequelize;
    },
  },
];
