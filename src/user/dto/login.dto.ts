import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
  @ApiProperty({ type: String, description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'Role',
    enum: ['Admin', 'Merchant', 'Customer', 'Test', 'Manufacturer'],
  })
  @IsNotEmpty()
  role: string;
}
