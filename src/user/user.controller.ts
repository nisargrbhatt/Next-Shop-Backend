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
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { getAllResDto } from './dto/getAllRes.dto';
import { createUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get('getAll')
  @ApiOkResponse({ description: 'Get All Users List', type: getAllResDto })
  async getAll(@Res() res) {
    let userData;
    try {
      userData = await this.userService.findAll();
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went Wrong',
      });
    }

    return res.status(HttpStatus.OK).json({ userData });
  }

  @Post('create')
  @ApiBody({ type: createUserDto })
  @ApiCreatedResponse({ description: 'Created the user', type: User })
  async create(@Body() body: createUserDto, @Res() res) {
    let createdUser;
    try {
      createdUser = await this.userService.create(body);
    } catch (error) {
      console.log(error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went Wrong',
      });
    }
    console.log(createdUser);
    return res.status(HttpStatus.CREATED).json({ createdUser });
  }

  @Post('login')
  @ApiBody({ type: loginDto })
  async login(@Body() body: loginDto, @Res() res) {
    let user;
    try {
      user = await this.userService.findOneByEmail(body.email);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went Wrong',
      });
    }
    if (!user) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid Creadential',
      });
    }
    console.log(user);
    if (user['password'] !== body.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid Creadential',
      });
    }

    let token = await this.jwtService.signAsync({ userId: user['uuid'] });

    return res.status(HttpStatus.OK).json({
      token: token,
      expiresIn: 86400,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('test')
  async test(@Req() req: any, @Res() res) {
    let user = req.user;
    return res.status(HttpStatus.OK).json({
      user,
    });
  }
}
