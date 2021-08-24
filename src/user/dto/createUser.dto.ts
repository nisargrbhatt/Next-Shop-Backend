import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class createUserDto {
  @ApiProperty({ type: String, description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'Name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: String, description: 'Contact No' })
  @IsNotEmpty()
  contact_no: string;

  @ApiProperty({
    type: String,
    description: 'Role',
    enum: ['Admin', 'Merchant', 'Customer', 'Test', 'Manufacturer'],
  })
  @IsNotEmpty()
  role: string;
}
