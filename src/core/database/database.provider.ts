import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { databaseConfig } from './database.config';
import { DatabaseConfigAttributes } from './dbconfig.interface';

export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config: DatabaseConfigAttributes;

      switch (process.env.NODE_ENV) {
        case process.env.DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case process.env.TEST:
          config = databaseConfig.test;
          break;
        case process.env.PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      const sequelize = new Sequelize(config.urlDatabase, { logging: false });
      sequelize.addModels([User]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
