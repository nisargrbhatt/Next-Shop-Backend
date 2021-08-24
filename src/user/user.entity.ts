import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

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

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: true,
  })
  uuid: string;
}
