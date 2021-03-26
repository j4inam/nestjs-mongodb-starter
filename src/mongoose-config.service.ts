import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const user: string = this.configService.get<string>('db.username');
    const password: string = this.configService.get<string>('db.password');
    const databaseName: string = this.configService.get<string>('db.database');

    const uri: string = this.configService
      .get<string>('db.host')
      .replace('<user>', user)
      .replace('<password>', password)
      .replace('<dbname>', databaseName);

    console.log('Connecting to DB at: ', uri);
    return {
      uri,
    };
  }
}
