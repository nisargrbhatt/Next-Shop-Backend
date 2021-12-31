import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'Name of the Customer, which will appear on bill',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    name: 'address_line1',
    description: 'Address line 1',
    required: true,
  })
  @IsNotEmpty()
  address_line1: string;

  @ApiProperty({
    type: String,
    name: 'address_line2',
    description: 'Address line 2',
    required: false,
  })
  @IsOptional()
  address_line2: string;

  @ApiProperty({
    type: String,
    name: 'city',
    description: 'City',
    required: true,
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    type: String,
    name: 'state',
    description: 'State',
    required: true,
  })
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    type: String,
    name: 'zipcode',
    description: 'Zipcode (Postal Code)',
    required: true,
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty()
  zipcode: string;

  @ApiProperty({
    type: String,
    name: 'contact_no',
    description: 'Contact No',
    required: true,
    minLength: 10,
    maxLength: 10,
  })
  @IsNotEmpty()
  contact_no: string;
}

export class UpdateAddressDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'Name of the Customer, which will appear on bill',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
    name: 'address_line1',
    description: 'Address line 1',
    required: false,
  })
  @IsOptional()
  address_line1: string;

  @ApiProperty({
    type: String,
    name: 'address_line2',
    description: 'Address line 2',
    required: false,
  })
  @IsOptional()
  address_line2: string;

  @ApiProperty({
    type: String,
    name: 'city',
    description: 'City',
    required: false,
  })
  @IsOptional()
  city: string;

  @ApiProperty({
    type: String,
    name: 'state',
    description: 'State',
    required: false,
  })
  @IsOptional()
  state: string;

  @ApiProperty({
    type: String,
    name: 'zipcode',
    description: 'Zipcode (Postal Code)',
    required: false,
    minLength: 6,
    maxLength: 6,
  })
  @IsOptional()
  zipcode: string;

  @ApiProperty({
    type: String,
    name: 'contact_no',
    description: 'Contact No',
    required: false,
    minLength: 10,
    maxLength: 10,
  })
  @IsOptional()
  contact_no: string;

  @ApiProperty({
    type: String,
    name: 'address_id',
    description: 'Address Id',
    required: true,
  })
  address_id: string;
}
