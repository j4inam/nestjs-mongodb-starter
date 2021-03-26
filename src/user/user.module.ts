import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalAuthGuard } from './local-auth.guard';
import { PassportJwtStrategy } from './passport-jwt.strategy';
import { PasspoprtLocalStrategy } from './passport-local.strategy';
import { AuthData, AuthDataSchema } from './schemas/auth-data.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthData.name, schema: AuthDataSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('settings.secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PasspoprtLocalStrategy,
    LocalAuthGuard,
    PassportJwtStrategy,
  ],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
