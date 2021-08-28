import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto, LoginDto } from './dto/request.dto';
import { Response } from 'express';
import {
  CreateUserData,
  CreateUserResponse,
  GetUserResponse,
  LoginData,
  LoginResponse,
} from './dto/response.dto';
import { createUserData } from './dto/param.interface';
import { User } from './user.entity';
import { NS_001, NS_002, NS_004 } from 'src/core/constants/error_codes';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('createUser')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: CreateUserResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiUnprocessableEntityResponse({
    description: 'User Data is not processable',
  })
  @ApiCreatedResponse({ description: 'User created successfully' })
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    let response: CreateUserResponse;

    let hashPassword = await hash(body.password, 10);

    let createUserData: createUserData = {
      ...body,
      password: hashPassword,
    };
    let createdUser: User;
    try {
      createdUser = await this.userService.create(createUserData);
    } catch (error) {
      console.error(error);
      response = {
        message: 'Something went wrong',
        valid: false,
        error: NS_002,
        dialog: {
          header: 'Server error',
          message: 'There is some error in server. Please try again later',
        },
      };
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    if (!createdUser) {
      response = {
        message: 'User Data is not processable',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong input',
          message: 'User input is not processable',
        },
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
    }

    let token = await this.jwtService.signAsync({ userId: createdUser.id });

    let responseData: CreateUserData = {
      token: token,
      expiresIn: 60 * 60 * 24 * 10,
      role: createdUser.role,
      access: process.env[createdUser.role.toUpperCase()],
    };

    response = {
      message: 'User created successfully',
      valid: true,
      data: responseData,
    };

    return res.status(HttpStatus.CREATED).json(response);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: LoginResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiBadRequestResponse({ description: 'Invalid auth credentials' })
  @ApiOkResponse({ description: 'User logged in successfully' })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    let response: LoginResponse;

    let logedUser: User;
    try {
      logedUser = await this.userService.findOneByEmailRole(
        body.email,
        body.role,
      );
    } catch (error) {
      console.error(error);
      response = {
        message: 'Something went wrong',
        valid: false,
        error: NS_002,
        dialog: {
          header: 'Server error',
          message: 'There is some error in server. Please try again later',
        },
      };
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    if (!logedUser) {
      response = {
        message: 'Invalid auth credentials',
        valid: false,
        error: NS_004,
        dialog: {
          header: 'Invalid Auth',
          message: 'Email/Password/Role is wrong',
        },
      };
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    let passwordCompare = compare(body.password, logedUser.password);

    if (!passwordCompare) {
      response = {
        message: 'Invalid auth credentials',
        valid: false,
        error: NS_004,
        dialog: {
          header: 'Invalid Auth',
          message: 'Email/Password/Role is wrong',
        },
      };
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    console.log(`${logedUser.name} is logged In.`);

    let token = await this.jwtService.signAsync({ userId: logedUser.id });

    let responseData: LoginData = {
      token: token,
      expiresIn: 60 * 60 * 24 * 10,
      role: logedUser.role,
      access: process.env[logedUser.role.toUpperCase()],
    };

    response = {
      message: 'User logged in successfully',
      valid: false,
      data: responseData,
    };

    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetUserResponse })
  @ApiFoundResponse({ description: 'User fetched successfully' })
  async getUser(@Req() req: { user: User }, @Res() res: Response) {
    let fetchedUser: User = req.user;

    let response: GetUserResponse = {
      message: 'User fetched successfully',
      valid: true,
      data: fetchedUser,
    };
    return res.status(HttpStatus.FOUND).json(response);
  }
}
