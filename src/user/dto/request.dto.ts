import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'Email',
    name: 'email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Name',
    name: 'name',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    name: 'password',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'Contact No',
    name: 'contact_no',
    required: true,
  })
  @IsNotEmpty()
  contact_no: string;

  @ApiProperty({
    type: String,
    description: 'Role',
    enum: ['Admin', 'Merchant', 'Customer', 'Test', 'Manufacturer'],
    name: 'role',
    required: true,
  })
  @IsNotEmpty()
  role: string;
}

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'Email',
    name: 'email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    name: 'password',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'Role',
    enum: ['Admin', 'Merchant', 'Customer', 'Test', 'Manufacturer'],
    name: 'role',
    required: true,
  })
  @IsNotEmpty()
  role: string;
}

export class EmailOtpCheckDto {
  @ApiProperty({
    type: String,
    name: 'otp',
    description: 'Otp from email',
    required: true,
  })
  @IsNotEmpty()
  otp: string;
}
