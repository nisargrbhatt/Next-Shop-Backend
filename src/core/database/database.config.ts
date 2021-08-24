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
    urlDatabase: process.env.PRODUCTION_DATABASE_URL,
  },
};
