import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import configuration from '../config/index';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose-config.service';
import { ProductsModule } from './products/products.module';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const ENV = process.env.NODE_ENV;
console.log('__dirname', __dirname);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      envFilePath: path.resolve(
        process.cwd(),
        'env',
        !ENV ? '.env' : `.env.${ENV}`,
      ),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get<any>('settings.smtp'),
        defaults: {
          from: configService.get<string>('settings.emailSender'),
        },
        template: {
          dir: path.join(
            __dirname,
            '..',
            configService.get<string>('settings.emailTemplateViews'),
          ),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    UserModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
