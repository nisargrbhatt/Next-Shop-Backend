import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto, EmailOtpCheckDto, LoginDto } from './dto/request.dto';
import { Response } from 'express';
import {
  CreateUserData,
  CreateUserResponse,
  EmailOtpCheckResponse,
  GetEmailOtpResponse,
  GetUserResponse,
  LoginData,
  LoginResponse,
} from './dto/response.dto';
import { createUserData } from './dto/param.interface';
import { User } from './user.entity';
import {
  NS_001,
  NS_002,
  NS_003,
  NS_004,
  NS_005,
  NS_006,
  NS_007,
  NS_008,
} from 'src/core/constants/error_codes';
import { SharedService } from 'src/shared/shared.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
@ApiTags('User')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly sharedService: SharedService,
    private readonly configService: ConfigService,
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
      this.logger.error(error);
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
      access: this.configService.get(
        createdUser.role.toUpperCase() + '_ACCESS',
      ),
      emailVerified: createdUser.email_verified,
      userId: createdUser.id,
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
      this.logger.error(error);
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

    let passwordCompare = await compare(body.password, logedUser.password);

    console.log(passwordCompare);

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

    this.logger.log(`${logedUser.name} is logged In.`);

    let token = await this.jwtService.signAsync({ userId: logedUser.id });

    let responseData: LoginData = {
      token: token,
      expiresIn: 60 * 60 * 24 * 10,
      role: logedUser.role,
      access: this.configService.get(logedUser.role.toUpperCase() + '_ACCESS'),
      emailVerified: logedUser.email_verified,
      userId: logedUser.id,
    };

    response = {
      message: 'User logged in successfully',
      valid: true,
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

  @Get('getEmailOtp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: GetEmailOtpResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiTooManyRequestsResponse({ description: 'Too many request' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiOkResponse({ description: 'Email sent successfully' })
  async getEmailOtp(@Req() req: { user: User }, @Res() res: Response) {
    let response: GetEmailOtpResponse;

    if (req.user.email_verified) {
      response = {
        message: 'Bad Request',
        valid: false,
        error: NS_005,
        dialog: {
          header: 'Bad API call',
          message: 'Bad Request to server',
        },
      };
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    if (req.user.email_otp_sent_time) {
      let lastEmailSentDate: any = new Date(req.user.email_otp_sent_time);
      let dateNow: any = new Date();

      let timeDiff = parseInt(
        ((dateNow - lastEmailSentDate) / (1000 * 60)).toFixed(),
      );
      if (timeDiff < 5) {
        response = {
          message: 'Too many request',
          valid: false,
          error: NS_007,
          dialog: {
            header: 'Too many attempts',
            message: 'You can send new mail after some time',
          },
        };
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json(response);
      }
    }

    let generatedOtp = this.sharedService.generateOTP();

    let updateUserData = {
      email_otp: generatedOtp,
      email_otp_sent_time: new Date().toJSON(),
    };

    let updatedUser;
    try {
      updatedUser = await this.userService.update(updateUserData, req.user.id);
    } catch (error) {
      this.logger.error(error);
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

    if (!updatedUser) {
      response = {
        message: 'Not authorized for this operation',
        valid: false,
        error: NS_003,
        dialog: {
          header: 'Not Authorized',
          message: 'You are not authorized for this operation',
        },
      };
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    let emailSent: { mail: any; error: boolean };
    try {
      emailSent = await this.sharedService.sendOtpMail(
        req.user.email,
        generatedOtp,
      );
    } catch (error) {
      this.logger.error(error);
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

    if (emailSent.error) {
      response = {
        message: 'Something went wrong',
        valid: false,
        error: NS_006,
        dialog: {
          header: 'Server error',
          message: 'There is some error in server. Please try again later',
        },
      };
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }

    response = {
      message: 'Email sent successfully',
      valid: true,
    };
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('emailOtpCheck')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: EmailOtpCheckDto })
  @ApiResponse({ type: EmailOtpCheckResponse })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiRequestTimeoutResponse({ description: 'Request timeout' })
  @ApiOkResponse({ description: 'Otp is wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorized for this operation' })
  @ApiAcceptedResponse({ description: 'Email Otp verified successfully' })
  async emailOtpCheck(
    @Req() req: { user: User },
    @Body() body: EmailOtpCheckDto,
    @Res() res: Response,
  ) {
    let response: EmailOtpCheckResponse;

    let emailSentDate: any = new Date(req.user.email_otp_sent_time);
    let dateNow: any = new Date();

    let timeDiff = parseInt(
      ((dateNow - emailSentDate) / (1000 * 60)).toFixed(),
    );

    if (timeDiff > 6) {
      response = {
        message: 'Request timeout',
        valid: false,
        error: NS_008,
        dialog: {
          header: 'Verification timeout',
          message: 'Email Otp expired',
        },
      };
      return res.status(HttpStatus.REQUEST_TIMEOUT).json(response);
    }

    if (body.otp !== req.user.email_otp) {
      response = {
        message: 'Otp is wrong',
        valid: false,
        error: NS_001,
        dialog: {
          header: 'Wrong OTP',
          message: 'You have entered wrong OTP',
        },
      };
      return res.status(HttpStatus.OK).json(response);
    }

    let updateUserData = {
      email_verified: true,
    };
    let updatedUser;
    try {
      updatedUser = await this.userService.update(updateUserData, req.user.id);
    } catch (error) {
      this.logger.error(error);
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

    if (!updatedUser) {
      response = {
        message: 'Not authorized for this operation',
        valid: false,
        error: NS_003,
        dialog: {
          header: 'Not Authorized',
          message: 'You are not authorized for this operation',
        },
      };
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    response = {
      message: 'Email Otp verified successfully',
      valid: true,
    };
    return res.status(HttpStatus.ACCEPTED).json(response);
  }

  @Get('emailCheck')
  @ApiQuery({ name: 'email', type: String, required: true })
  async emailCheck(@Query('email') email: string, @Res() res: Response) {
    let fetchedUser: User;
    try {
      fetchedUser = await this.userService.findOneByEmail(email);
    } catch (error) {
      return res.status(HttpStatus.OK).json({
        ok: true,
      });
    }
    if (fetchedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        ok: false,
      });
    } else {
      return res.status(HttpStatus.OK).json({
        ok: true,
      });
    }
  }
}
