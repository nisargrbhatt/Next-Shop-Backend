import { SequelizeOptions } from 'sequelize-typescript';

export interface DatabaseConfigAttributes {
  urlDatabase?: string;
}

export interface DatabaseConfig {
  development: DatabaseConfigAttributes;
  test: DatabaseConfigAttributes;
  production: SequelizeOptions;
}
