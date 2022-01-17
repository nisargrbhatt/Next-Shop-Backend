import * as dotenv from 'dotenv';
import { DatabaseConfig } from './dbconfig.interface';
dotenv.config();

export const databaseConfig: DatabaseConfig = {
  development: {
    urlDatabase: process.env.DEVELOPMENT_DATABASE_URL,
  },
  test: {
    urlDatabase: process.env.TEST_DATABASE_URL,
  },
  production: {
    // uri: process.env.PRODUCTION_DATABASE_URL,
    host: process.env.PRODUCTION_DATABASE_HOST,
    database: process.env.PRODUCTION_DATABASE_NAME,
    username: process.env.PRODUCTION_DATABASE_USER,
    port: Number(process.env.PRODUCTION_DATABASE_PORT),
    password: process.env.PRODUCTION_DATABASE_PASSWORD,
    logging: false,
    protocol: 'postgres',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
