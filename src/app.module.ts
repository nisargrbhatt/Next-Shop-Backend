import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MorganModule } from 'nest-morgan';
import { AppController } from './app.controller';
import { AppProviders } from './app.provider';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    MorganModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...AppProviders],
})
export class AppModule {}
