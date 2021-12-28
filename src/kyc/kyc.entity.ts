import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { KYCImage } from './kyc-image/kyc-image.entity';

@Table({})
export class KYC extends Model<KYC> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    comment: 'Aadhaar Registered Name',
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    comment: 'Aadhaar Number',
    allowNull: false,
    validate: {
      len: { args: [12, 12], msg: 'Aadhaar Number length is 12 digits only.' },
    },
  })
  aadhaar_number: string;

  @Column({
    type: DataType.TEXT,
    comment: 'Aadhaar Registered Number',
    allowNull: true,
  })
  contact_no: string;

  @Column({
    type: DataType.TEXT,
    comment: 'Aadhaar Registered Email',
    allowNull: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'User Id',
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => KYCImage)
  images: KYCImage;
}
