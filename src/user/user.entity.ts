import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/product/product.entity';
import { Review } from 'src/review/review.entity';
import { Address } from './addresses/address.entity';

@Table({})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  contact_no: string;

  @Column({
    type: DataType.ENUM,
    values: ['Admin', 'Merchant', 'Customer', 'Test', 'Manufacturer'],
    allowNull: false,
  })
  role: string;

  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => Cart)
  cart: Cart[];

  @HasMany(() => Review)
  reviewes: Review[];

  toJSON() {
    return {
      ...this.get(),
      password: undefined,
    };
  }
}
