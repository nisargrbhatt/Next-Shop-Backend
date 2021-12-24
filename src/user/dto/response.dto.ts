import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export interface errorData {
  code: string;
  message: string;
}

export interface dialogData {
  header: string;
  message: string;
}

export interface CreateUserData {
  token: string;
  expiresIn: number;
  role: string;
  access: string;
  emailVerified: boolean;
  userId: string;
}
export interface OAuthCallData {
  role: string;
  access: string;
  emailVerified: boolean;
  userId: string;
}

export interface LoginData {
  token: string;
  expiresIn: number;
  role: string;
  access: string;
  emailVerified: boolean;
  userId: string;
}

export class CreateUserResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;

  @ApiResponseProperty({
    type: Object,
  })
  data?: CreateUserData;
}

export class LoginResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;

  @ApiResponseProperty({
    type: Object,
  })
  data?: LoginData;
}

export class GetUserResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;

  @ApiResponseProperty({
    type: Object,
  })
  data?: User;
}

export class GetEmailOtpResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;
}

export class EmailOtpCheckResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;
}

export class OAuthCallResponse {
  @ApiResponseProperty({ type: String })
  message: string;

  @ApiResponseProperty({ type: Boolean, example: 'true/false' })
  valid: boolean;

  @ApiResponseProperty({
    type: 'object',
    example: "code:'Error code',message:'Error message'",
  })
  error?: errorData;

  @ApiResponseProperty({
    type: 'object',
    example: "header:'Dialog header',message:'Dialog message'",
  })
  dialog?: dialogData;

  @ApiResponseProperty({
    type: Object,
  })
  data?: OAuthCallData;
}
