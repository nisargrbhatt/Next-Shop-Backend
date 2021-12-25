import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwtPayload.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get(
          'AUTH0_ISSUER_URL',
        )}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AUTH0_AUDIENCE'),
      issuer: configService.get('AUTH0_ISSUER_URL'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    let role: string;
    switch (payload['azp']) {
      case this.configService.get('CUSTOMER_AUTH0_CLIENTID'):
        role = 'Customer';
        break;
      case this.configService.get('ADMIN_AUTH0_CLIENTID'):
        role = 'Admin';
        break;
      case this.configService.get('MERCHANT_AUTH0_CLIENTID'):
        role = 'Merchant';
        break;
      case this.configService.get('MANUFACTURER_AUTH0_CLIENTID'):
        role = 'Manufacturer';
        break;
    }

    const user: User = await this.userService.findOneByPk(
      payload['sub'] + '|' + role,
    );

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
