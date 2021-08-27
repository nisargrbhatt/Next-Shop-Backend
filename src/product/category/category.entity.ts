import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from '../product.entity';

@Table({})
export class Category extends Model<Category> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Product)
  products: Product[];
}
