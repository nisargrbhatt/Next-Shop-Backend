import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwtPayload.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWTKEY,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOneByUuid(payload.userId);

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
